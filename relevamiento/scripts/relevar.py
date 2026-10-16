"""Relevamiento de deturista.com: recorre todas las páginas públicas y guarda
qué tiene cada una (SEO, contenido, componentes) más los datos de la parte
pública del admin. Uso: python3 -I relevar.py <carpeta_salida>"""
import json, re, sys, html, time, os, ssl, urllib.request, urllib.parse, concurrent.futures as cf
from collections import Counter

WEB = 'https://www.deturista.com'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'datos'
os.makedirs(OUT, exist_ok=True)
CTX = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt')
UA = {'User-Agent': 'Mozilla/5.0 (relevamiento DeTurista marketing)'}

def bajar(url, intentos=3):
    url = urllib.parse.quote(url, safe=':/?=&%#')
    for i in range(intentos):
        try:
            t = time.time()
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), context=CTX, timeout=40) as r:
                b = r.read()
                return r.status, b.decode('utf-8', 'ignore'), round(time.time() - t, 2), len(b), r.geturl()
        except urllib.error.HTTPError as e:
            return e.code, '', 0, 0, url
        except Exception:
            time.sleep(2 ** i)
    return 0, '', 0, 0, url

def texto(s):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', s or '')).split())

def meta(h, nombre):
    m = re.search(r'<meta[^>]+(?:name|property)="%s"[^>]+content="([^"]*)"' % re.escape(nombre), h)
    return html.unescape(m.group(1)) if m else ''

def cuerpo(h):
    b = h[h.find('<body'):]
    return re.sub(r'<(script|style)\b.*?</\1>', '', b, flags=re.S)

def analizar(url, tipo):
    st, h, seg, peso, final = bajar(WEB + url)
    b = cuerpo(h)
    fila = {
        'url': url, 'tipo': tipo, 'estado': st, 'final': final.replace(WEB, ''), 'segundos': seg, 'kb': peso // 1024,
        'title': texto((re.search(r'<title>(.*?)</title>', h, re.S) or [None, ''])[1]),
        'description': meta(h, 'description'), 'robots': meta(h, 'robots'),
        'canonical': (re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]*)"', h) or [None, ''])[1],
        'og_image': meta(h, 'og:image'),
        'h1': [texto(x) for x in re.findall(r'<h1[^>]*>(.*?)</h1>', b, re.S)][:3],
        'imagenes': len(re.findall(r'<img\b', b)),
        'imagenes_sin_alt': len(re.findall(r'<img\b(?![^>]*\balt="[^"]+")[^>]*>', b)),
        'links_paquete': sorted(set(re.findall(r'href="(/paquete/\d+/[^"]+)"', b))),
        'links_destino': sorted(set(re.findall(r'href="(/destino/[^"]+)"', b))),
        'links_categoria': sorted(set(x.replace(WEB, '') for x in re.findall(r'href="((?:%s)?/categoria/[^"]+)"' % re.escape(WEB), b))),
        'json_ld': len(re.findall(r'application/ld\+json', h)),
    }
    if tipo == 'paquete':
        cajas = b.split('class="departure-box')[1:]
        fila['salidas'] = len(cajas)
        fila['avisos'] = Counter(re.sub(r'\d+', 'N', m) for m in re.findall(r'departure-badge[^"]*">\s*(?:<i[^>]*></i>)?\s*([^<]+?)\s*<', h))
        fila['filtros'] = sorted(set(re.findall(r'data-filter="([^"]+)"', b)))
        fila['relacionados'] = h.count('Paquete Relacionado')
        fila['banner_categoria'] = bool(re.search(r'images/Category/\d+/original/', b))
        fila['servicios'] = [texto(x) for x in re.findall(r'<li[^>]*class="[^"]*service[^"]*"[^>]*>(.*?)</li>', b, re.S)][:10]
    if tipo in ('destino', 'pais', 'categoria'):
        fila['tarjetas'] = len(re.findall(r'class="[^"]*\bitem\b', b))
    return fila

def main():
    # 1. Catálogo de la parte pública del admin
    _, j, *_ = bajar(WEB + '/model/public/products/get_all')
    productos = json.loads(j)['data']['results']
    json.dump(productos, open(f'{OUT}/api_productos.json', 'w'), ensure_ascii=False, indent=1)

    # 2. Semillas: home + menú
    _, home, *_ = bajar(WEB + '/')
    urls = {'/': 'home'}
    for u in set(re.findall(r'href="(/destino/[^"]+)"', home)):
        urls[u] = 'pais' if u.count('/') >= 3 else 'destino'
    for u in set(re.findall(r'href="(?:%s)?(/categoria/[^"]+)"' % re.escape(WEB), home)):
        urls[u] = 'categoria'
    for u in ['/shop.html', '/sobre_nosotros.html', '/consulta', '/giftcards', '/condiciones.html', '/privacidad.html',
              '/cancelaciones.html', '/documentacion.html', '/medios_de_pago.html', '/giftcards_legal.html',
              '/sitemap.xml', '/robots.txt', '/no-existe-esta-pagina', '/listado']:
        urls[u] = 'estatica'
    for p in productos:
        urls['/paquete/' + p['url']] = 'paquete'

    # 3. Recorrer, sumando lo que aparezca en regiones y categorías
    hechas, filas = set(), []
    with cf.ThreadPoolExecutor(4) as ex:
        while True:
            nuevas = [u for u in urls if u not in hechas]
            if not nuevas:
                break
            for f in ex.map(lambda u: analizar(u, urls[u]), nuevas):
                hechas.add(f['url']); filas.append(f)
                for u in f['links_destino']:
                    urls.setdefault(u, 'pais' if u.count('/') >= 3 else 'destino')
                for u in f['links_categoria']:
                    urls.setdefault(u, 'categoria')
                for u in f['links_paquete']:
                    urls.setdefault(u, 'paquete')
            print('páginas', len(hechas), flush=True)
    json.dump(filas, open(f'{OUT}/paginas.json', 'w'), ensure_ascii=False, indent=1)

    # 4. Detalle por salida (primera salida de cada paquete): precios, bases, hoteles, vuelos, descripción
    def detalle(p):
        dep = p.get('price_from_id_departure')
        if not dep:
            return None
        st, j, *_ = bajar(f"{WEB}/public/product/prices/{p['id']}?departure={dep}")
        try:
            return json.loads(j)['data']
        except Exception:
            return None
    with cf.ThreadPoolExecutor(6) as ex:
        det = dict(zip([p['id'] for p in productos], ex.map(detalle, productos)))
    json.dump(det, open(f'{OUT}/api_salidas.json', 'w'), ensure_ascii=False, indent=1)
    print('listo', len(filas), 'páginas,', len(productos), 'paquetes')

if __name__ == '__main__':
    main()
