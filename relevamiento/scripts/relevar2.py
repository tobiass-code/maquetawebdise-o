"""Segunda pasada: todas las salidas de cada paquete, categorías del admin,
contenido de las páginas fijas y casos límite para el diseño.
Uso: python3 -I relevar2.py <carpeta_datos>  (después de relevar.py)"""
import json, re, sys, os, unicodedata, concurrent.futures as cf
from collections import Counter
sys.path.insert(0, os.path.dirname(__file__))
from relevar import bajar, texto, cuerpo, WEB

OUT = sys.argv[1] if len(sys.argv) > 1 else 'datos'
productos = json.load(open(f'{OUT}/api_productos.json'))

# 1. Todas las salidas de cada paquete (ids desde la página)
def salidas_de(p):
    st, h, *_ = bajar(f"{WEB}/paquete/{p['url']}")
    ids = []
    for c in h.split('class="departure-box')[1:]:
        m = re.search(r'show-info[^>]*data-id="(\d+)"', c) or re.search(r'departure-summary-(\d+)', c)
        if m and m.group(1) not in ids:
            ids.append(m.group(1))
    return p['id'], ids

with cf.ThreadPoolExecutor(4) as ex:
    ids_por_paquete = dict(ex.map(salidas_de, productos))

def detalle(par):
    pid, dep = par
    st, j, *_ = bajar(f"{WEB}/public/product/prices/{pid}?departure={dep}")
    try:
        d = json.loads(j)['data']
        d.pop('product_description', None)  # ya está en api_salidas.json
        return pid, dep, d
    except Exception:
        return pid, dep, None

pares = [(pid, d) for pid, ids in ids_por_paquete.items() for d in ids]
with cf.ThreadPoolExecutor(6) as ex:
    todas = list(ex.map(detalle, pares))
json.dump([{'paquete': a, 'salida': b, 'datos': c} for a, b, c in todas], open(f'{OUT}/api_todas_las_salidas.json', 'w'), ensure_ascii=False)
print('salidas', len(todas), 'con datos', sum(1 for *_, c in todas if c))

# 2. Categorías del admin: probar la URL de cada una
def slug(s):
    s = unicodedata.normalize('NFKD', s.lower()).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '_', s).strip('_')

cats = {}
for p in productos:
    for c in p['categories']:
        cats[c['id']] = c['name']
def probar(item):
    cid, nombre = item
    u = f"/categoria/{slug(nombre)}-{cid}"
    st, h, *_ = bajar(WEB + u)
    b = cuerpo(h)
    return {'id': cid, 'nombre': nombre, 'url': u, 'estado': st,
            'paquetes_en_pagina': len(set(re.findall(r'href="/paquete/(\d+)/', b))),
            'paquetes_en_api': sum(1 for p in productos if any(c['id'] == cid for c in p['categories'])),
            'banner': bool(re.search(r'images/Category/\d+/', b)),
            'title': texto((re.search(r'<title>(.*?)</title>', h, re.S) or [None, ''])[1])}
with cf.ThreadPoolExecutor(4) as ex:
    categorias = list(ex.map(probar, sorted(cats.items())))
json.dump(categorias, open(f'{OUT}/categorias.json', 'w'), ensure_ascii=False, indent=1)
print('categorías', len(categorias), Counter(c['estado'] for c in categorias))

# 3. Contenido de páginas fijas
fijas = {}
for u in ['/sobre_nosotros.html', '/shop.html', '/giftcards', '/consulta', '/condiciones.html', '/privacidad.html',
          '/cancelaciones.html', '/documentacion.html', '/medios_de_pago.html', '/giftcards_legal.html', '/listado']:
    st, h, *_ = bajar(WEB + u)
    b = cuerpo(h)
    i = b.find('</header>'); f = b.find('newsletter-form')
    zona = b[i if i > 0 else 0: f if f > 0 else len(b)]
    t = texto(zona)
    fijas[u] = {
        'palabras': len(t.split()),
        'titulos': [texto(x) for x in re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', zona, re.S)][:40],
        'imagenes': len(re.findall(r'<img\b', zona)),
        'formularios': len(re.findall(r'<form\b', zona)),
        'campos': re.findall(r'<(?:input|select|textarea)[^>]*name="([^"]+)"', zona)[:40],
        'inicio': t[:600],
    }
    if u == '/shop.html':
        fijas[u]['productos'] = len(re.findall(r'C[óo]digo', t))
        fijas[u]['precios'] = re.findall(r'\$\s?[\d.]+', t)[:200]
    if u == '/sobre_nosotros.html':
        fijas[u]['equipo'] = re.findall(r'([\w.]+@deturista\.com)', t)
    if u == '/giftcards':
        fijas[u]['montos'] = re.findall(r'(?:USD|U\$S|\$)\s?[\d.]+', t)[:20]
json.dump(fijas, open(f'{OUT}/paginas_fijas.json', 'w'), ensure_ascii=False, indent=1)
print('fijas', {k: v['palabras'] for k, v in fijas.items()})
