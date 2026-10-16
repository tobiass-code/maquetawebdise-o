// Flujos interactivos de deturista.com con Playwright. Uso: node flujos.js <carpeta_capturas> <salida.json>
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs');
const [dir, salida] = process.argv.slice(2);
const WEB = 'https://www.deturista.com';
const PAQ = '/paquete/2252/eurotrip_tu_primer_viaje_a_europa_-_salida_en_grupos.html';
const PLAYA = '/paquete/146/paquete_combinado_a_rio_de_janeiro__buzios.html';
const res = {};
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ['--ignore-certificate-errors'] });
  const nuevo = async (w, h, mobile) => (await b.newContext({ viewport: { width: w, height: h }, isMobile: !!mobile, hasTouch: !!mobile, ignoreHTTPSErrors: true })).newPage();

  // Velocidad y peso real en navegador
  res.velocidad = {};
  for (const [n, u, w, h, m] of [['home-escritorio', '/', 1440, 900], ['home-celular', '/', 390, 844, 1], ['paquete-celular', PAQ, 390, 844, 1], ['pais-celular', '/destino/europa-4/espana-49', 390, 844, 1]]) {
    const p = await nuevo(w, h, m); let bytes = 0, reqs = 0, errores = [];
    p.on('response', async r => { reqs++; const l = Number(r.headers()['content-length'] || 0); bytes += l; });
    p.on('pageerror', e => errores.push(String(e).slice(0, 120)));
    p.on('console', c => { if (c.type() === 'error') errores.push(c.text().slice(0, 120)); });
    const t = Date.now(); await p.goto(WEB + u, { waitUntil: 'load', timeout: 60000 });
    const load = Date.now() - t;
    const nav = await p.evaluate(() => { const e = performance.getEntriesByType('navigation')[0]; const lcp = performance.getEntriesByType('largest-contentful-paint'); return { ttfb: Math.round(e.responseStart), dcl: Math.round(e.domContentLoadedEventEnd) }; });
    await p.waitForTimeout(2500);
    res.velocidad[n] = { load_ms: load, ...nav, pedidos: reqs, mb_declarados: +(bytes / 1048576).toFixed(1), errores: [...new Set(errores)].slice(0, 6) };
    await p.context().close();
  }

  // Buscador de la home
  {
    const p = await nuevo(1440, 900);
    await p.goto(WEB + '/', { waitUntil: 'networkidle' });
    res.buscador = { destinos: await p.$$eval('#select-destination option', o => o.map(x => x.textContent.trim()).filter(Boolean)), meses: await p.$$eval('#select-month option', o => o.map(x => x.textContent.trim()).filter(Boolean)) };
    await p.selectOption('#select-destination', { index: 2 }).catch(() => {});
    await Promise.all([p.waitForLoadState('networkidle').catch(() => {}), p.click('#search-product').catch(() => {})]);
    await p.waitForTimeout(3000);
    res.buscador.resultado_url = p.url().replace(WEB, '');
    await p.screenshot({ path: `${dir}/buscador-resultado.png`, fullPage: false });
    // buscador de texto del header
    await p.goto(WEB + '/', { waitUntil: 'networkidle' });
    await p.click('a[href="javascript:void(0);"] >> nth=-1').catch(() => {});
    const q = p.locator('input[name="q"]');
    if (await q.isVisible().catch(() => false)) { await q.fill('Bariloche'); await Promise.all([p.waitForLoadState('networkidle').catch(() => {}), q.press('Enter')]); await p.waitForTimeout(2500); res.buscador.texto_url = p.url().replace(WEB, ''); res.buscador.texto_resultados = await p.locator('a[href^="/paquete/"]').count(); await p.screenshot({ path: `${dir}/buscador-texto.png` }); }
    await p.context().close();
  }

  // Consultar desde una salida
  {
    const p = await nuevo(1440, 900);
    await p.goto(WEB + PAQ, { waitUntil: 'networkidle' });
    await p.getByText('Ver más info').first().click(); await p.waitForTimeout(2000);
    await p.getByText('Consultar').first().click().catch(() => {}); await p.waitForTimeout(2500);
    res.consultar = { url: p.url().replace(WEB, ''), campos: await p.$$eval('.modal.in input, .modal.in select, .modal.in textarea, .modal.show input, .modal.show textarea, .modal.show select', e => e.map(x => x.name || x.placeholder || x.id)) };
    await p.screenshot({ path: `${dir}/consultar.png` });
    await p.context().close();
  }

  // Hotel (paquete de playa con fichas de hotel)
  {
    const p = await nuevo(1440, 900);
    await p.goto(WEB + PLAYA, { waitUntil: 'networkidle' });
    await p.getByText('Ver más info').first().click(); await p.waitForTimeout(2000);
    await p.getByText('Ver Detalles').first().click().catch(() => {}); await p.waitForTimeout(1500);
    await p.screenshot({ path: `${dir}/playa-detalle.png`, fullPage: true });
    const link = p.locator('a[href*="/public/hotel/"]').first();
    res.hotel = { links: await p.locator('a[href*="/public/hotel/"]').count() };
    if (res.hotel.links) {
      const [np] = await Promise.all([p.context().waitForEvent('page', { timeout: 6000 }).catch(() => null), link.click().catch(() => {})]);
      const t = np || p; await t.waitForTimeout(2500); res.hotel.url = t.url().replace(WEB, ''); await t.screenshot({ path: `${dir}/hotel.png`, fullPage: true });
      res.hotel.texto = (await t.evaluate(() => (document.querySelector('.modal.in, .modal.show') || document.body).innerText)).slice(0, 1500);
    }
    await p.context().close();
  }

  // Celular: menú, filtros
  {
    const p = await nuevo(390, 844, 1);
    await p.goto(WEB + '/', { waitUntil: 'networkidle' });
    await p.locator('.navbar-toggle, .menu-toggle, .hamburger, [class*="toggle"]').first().click().catch(() => {});
    await p.waitForTimeout(1200); await p.screenshot({ path: `${dir}/celular-menu.png` });
    await p.goto(WEB + '/paquete/1741/paquete_a_bariloche_con_excursion.html', { waitUntil: 'networkidle' });
    await p.screenshot({ path: `${dir}/celular-paquete.png` });
    await p.getByText('Filtros').first().click().catch(() => {}); await p.waitForTimeout(1200);
    await p.screenshot({ path: `${dir}/celular-filtros.png` });
    await p.context().close();
  }
  fs.writeFileSync(salida, JSON.stringify(res, null, 1));
  await b.close();
})();
