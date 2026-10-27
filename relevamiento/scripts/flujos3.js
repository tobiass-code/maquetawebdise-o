// Tercera pasada: todas las plantillas en celular, estados de error y estilo actual.
// Uso: node flujos3.js <capturas> <salida.json>
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs');
const [dir, salida] = process.argv.slice(2);
const WEB = 'https://www.deturista.com';
const res = { estilo: {}, celular: [], estados: {} };
const PAGINAS = [
  ['region', '/destino/europa-4'], ['pais', '/destino/europa-4/espana-49'], ['ciudad-vacia', '/destino/europa-4/alemania-38/brandemburgo-915'],
  ['categoria', '/categoria/salidas_grupales-159'], ['paquete-grupal', '/paquete/2252/eurotrip_tu_primer_viaje_a_europa_-_salida_en_grupos.html'],
  ['paquete-playa', '/paquete/146/paquete_combinado_a_rio_de_janeiro__buzios.html'], ['shop', '/shop.html'], ['giftcards', '/giftcards'],
  ['quienes-somos', '/sobre_nosotros.html'], ['contacto', '/consulta'], ['legal', '/condiciones.html'], ['error-404', '/no-existe-esta-pagina'],
];
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ['--ignore-certificate-errors'] });
  const nuevo = async (w, h, m) => (await b.newContext({ viewport: { width: w, height: h }, isMobile: !!m, hasTouch: !!m, ignoreHTTPSErrors: true })).newPage();

  // Estilo actual: tipografías, colores, íconos, botones (en home y paquete)
  {
    const p = await nuevo(1440, 900);
    for (const u of ['/', '/paquete/2252/eurotrip_tu_primer_viaje_a_europa_-_salida_en_grupos.html', '/consulta']) {
      await p.goto(WEB + u, { waitUntil: 'networkidle' });
      const e = await p.evaluate(() => {
        const cuenta = (m, k) => { m[k] = (m[k] || 0) + 1; };
        const fuentes = {}, colores = {}, fondos = {}, tamanos = {}, radios = {}, iconos = {};
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
          const s = getComputedStyle(el);
          if (el.childNodes.length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) {
            cuenta(fuentes, s.fontFamily.split(',')[0].replace(/["']/g, '') + ' ' + s.fontWeight); cuenta(colores, s.color); cuenta(tamanos, s.fontSize);
          }
          if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') cuenta(fondos, s.backgroundColor);
          if (s.borderRadius !== '0px') cuenta(radios, s.borderRadius);
          for (const c of el.classList) if (/^fa-[a-z]/.test(c) && !/^fa-(lg|2x|3x|fw|stack|inverse)$/.test(c)) cuenta(iconos, c);
        }
        const top = (m, n) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
        const botones = [...document.querySelectorAll('button, .btn, a.btn')].filter(x => x.getBoundingClientRect().width).slice(0, 60).map(x => { const s = getComputedStyle(x); return `${s.backgroundColor}|${s.color}|${s.borderRadius}|${s.fontSize}`; });
        return { fuentes: top(fuentes, 10), colores: top(colores, 12), fondos: top(fondos, 12), tamanos: top(tamanos, 14), radios: top(radios, 8), iconos: top(iconos, 60), botones: top(botones.reduce((m, k) => (m[k] = (m[k] || 0) + 1, m), {}), 10) };
      });
      res.estilo[u] = e;
    }
    await p.context().close();
  }

  // Todas las plantillas en celular
  {
    const p = await nuevo(390, 844, 1);
    for (const [n, u] of PAGINAS) {
      try { await p.goto(WEB + u, { waitUntil: 'networkidle', timeout: 45000 }); } catch {}
      await p.waitForTimeout(1200);
      const alto = await p.evaluate(() => document.body.scrollHeight);
      const desborde = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      await p.screenshot({ path: `${dir}/celular-${n}.png`, fullPage: alto < 9000 });
      res.celular.push({ pagina: n, url: u, alto_px: alto, pantallas: +(alto / 844).toFixed(1), scroll_horizontal: desborde });
    }
    await p.context().close();
  }

  // Estados: checkout sin datos, newsletter vacío, búsqueda sin resultados, compra en celular
  {
    const p = await nuevo(390, 844, 1);
    await p.goto(WEB + '/compra/paquete/2252/eurotrip_tu_primer_viaje_a_europa_-_salida_en_grupos/precio/70466/0-1-0-0-0-0-0-0', { waitUntil: 'networkidle' });
    await p.screenshot({ path: `${dir}/celular-checkout.png`, fullPage: true });
    res.estados.checkout_alto = await p.evaluate(() => document.body.scrollHeight);
    const conf = p.locator('button:has-text("Confirmar"), button:has-text("Pagar"), button[type=submit]').last();
    res.estados.checkout_boton = await conf.textContent().catch(() => null);
    await p.context().close();
  }
  {
    const p = await nuevo(1440, 900);
    await p.goto(WEB + '/', { waitUntil: 'networkidle' });
    await p.locator('#newsletter-form button, #newsletter-form [type=submit]').first().click().catch(() => {});
    await p.waitForTimeout(1500);
    res.estados.newsletter_vacio = await p.evaluate(() => [...document.querySelectorAll('.toast, .toast-message, .error, .has-error, .invalid-feedback')].map(x => x.innerText.trim()).filter(Boolean).slice(0, 5));
    await p.locator('#newsletter-form').screenshot({ path: `${dir}/newsletter-error.png` }).catch(() => {});
    await p.goto(WEB + '/paquete/2252/eurotrip_tu_primer_viaje_a_europa_-_salida_en_grupos.html', { waitUntil: 'networkidle' });
    await p.locator('input[data-filter="luggage"], input[name="luggage"]').first().check().catch(() => {});
    await p.locator('input[name="months"]').last().check().catch(() => {});
    await p.locator('.btn-apply-filters:visible').first().click().catch(() => {});
    await p.waitForTimeout(1500);
    res.estados.filtros_sin_resultado = await p.locator('#no-results:visible').count();
    await p.screenshot({ path: `${dir}/filtros-aplicados.png` });
    await p.context().close();
  }
  fs.writeFileSync(salida, JSON.stringify(res, null, 1));
  await b.close();
})();
