// Segunda pasada: buscador con select2, consultar con pasajeros, menú celular. Uso: node flujos2.js <capturas> <salida.json>
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs');
const [dir, salida] = process.argv.slice(2);
const WEB = 'https://www.deturista.com';
const res = {};
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ['--ignore-certificate-errors'] });
  const nuevo = async (w, h, m) => (await b.newContext({ viewport: { width: w, height: h }, isMobile: !!m, hasTouch: !!m, ignoreHTTPSErrors: true })).newPage();
  {
    const p = await nuevo(1440, 900); const xhr = [];
    p.on('request', r => { if (['xhr', 'fetch'].includes(r.resourceType())) xhr.push(r.method() + ' ' + r.url().replace(WEB, '')); });
    await p.goto(WEB + '/', { waitUntil: 'networkidle' });
    await p.click('#select2-select-destination-container, .select2-selection >> nth=0').catch(() => {});
    await p.waitForTimeout(800); await p.keyboard.type('Bra', { delay: 120 }); await p.waitForTimeout(2500);
    res.opciones = await p.$$eval('.select2-results__option', o => o.map(x => x.textContent.trim()).slice(0, 15));
    await p.screenshot({ path: `${dir}/buscador-opciones.png` });
    await p.keyboard.press('Enter'); await p.waitForTimeout(500);
    await Promise.all([p.waitForNavigation({ timeout: 15000 }).catch(() => {}), p.click('#search-product')]);
    await p.waitForTimeout(2500);
    res.buscar_url = p.url().replace(WEB, ''); res.xhr = [...new Set(xhr)].slice(0, 15);
    res.buscar_resultados = await p.locator('a[href^="/paquete/"]').count();
    await p.screenshot({ path: `${dir}/buscador-resultado.png`, fullPage: false });
    await p.context().close();
  }
  {
    const p = await nuevo(1440, 900);
    await p.goto(WEB + '/paquete/2252/eurotrip_tu_primer_viaje_a_europa_-_salida_en_grupos.html', { waitUntil: 'networkidle' });
    await p.getByText('Ver más info').first().click(); await p.waitForTimeout(2000);
    const sel = p.locator('select:visible').filter({ has: p.locator('option[value="2"]') }).first();
    await sel.selectOption('2').catch(() => {});
    await p.getByText('Consultar').first().click(); await p.waitForTimeout(3000);
    res.consultar_url = p.url().replace(WEB, '');
    await p.screenshot({ path: `${dir}/consultar.png` });
    res.consultar_texto = (await p.evaluate(() => { const m = document.querySelector('.modal.in, .modal.show, .modal[style*="block"]'); return m ? m.innerText : ''; })).slice(0, 800);
    await p.context().close();
  }
  {
    const p = await nuevo(390, 844, 1);
    await p.goto(WEB + '/', { waitUntil: 'networkidle' });
    await p.mouse.click(345, 30); await p.waitForTimeout(1500);
    await p.screenshot({ path: `${dir}/celular-menu.png` });
    await p.getByText('Destinos').first().click().catch(() => {}); await p.waitForTimeout(1200);
    await p.screenshot({ path: `${dir}/celular-menu-destinos.png` });
    await p.context().close();
  }
  fs.writeFileSync(salida, JSON.stringify(res, null, 1)); await b.close();
})();
