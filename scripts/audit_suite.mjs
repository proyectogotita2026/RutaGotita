import { createServer } from 'vite';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve('audit-screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

console.log('Iniciando Vite server en memoria...');
const server = await createServer({
  server: { port: 5188, host: '127.0.0.1' },
  clearScreen: false,
});
await server.listen();
const port = server.config.server.port;
console.log(`Vite escuchando en http://127.0.0.1:${port}`);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: 'landscape_mobile_732x352', width: 732, height: 352 },
  { name: 'landscape_mobile_844x390', width: 844, height: 390 },
  { name: 'portrait_mobile_390x844', width: 390, height: 844 },
  { name: 'tablet_landscape_1024x768', width: 1024, height: 768 },
  { name: 'desktop_1440x900', width: 1440, height: 900 },
];

const auditResults = [];

try {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================`);
    console.log(`Auditando Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(4000);

    const checkMetrics = async (screenName) => {
      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollH = Math.max(doc.scrollHeight, body.scrollHeight);
        const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
        return {
          scrollH,
          innerH: window.innerHeight,
          scrollW,
          innerW: window.innerWidth,
          overflowY: scrollH > window.innerHeight + 1,
          overflowX: scrollW > window.innerWidth + 1,
        };
      });

      console.log(`  -> ${screenName}: OverflowY=${metrics.overflowY} (${metrics.scrollH}/${metrics.innerH}), OverflowX=${metrics.overflowX} (${metrics.scrollW}/${metrics.innerW})`);
      auditResults.push({ screen: screenName, viewport: vp.name, ...metrics });
      return metrics;
    };

    // 1. Portada
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `01_cover_${vp.name}.png`) });
    await checkMetrics('Portada');

    // 2. Mapa interactivo
    await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `02_map_${vp.name}.png`) });
    await checkMetrics('Mapa');

    // Revisar si OrientationGuard está bloqueando (en portrait)
    const isPortraitBlocked = await page.evaluate(() => {
      return document.body.innerText.includes('¡Gira tu dispositivo!');
    });

    if (isPortraitBlocked) {
      console.log(`  [Aviso] OrientationGuard bloqueó la pantalla en ${vp.name} (esperado en modo vertical)`);
    } else {
      // 3. Estación 1: abrir con Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `03_st1_${vp.name}.png`) });
      await checkMetrics('Estacion 1');

      // Cerrar y avanzar a Estación 2 con ArrowRight
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);

      // 4. Estación 2: abrir con Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `04_st2_intro_${vp.name}.png`) });
      await checkMetrics('Estacion 2 Intro');

      // Si existe botón de comenzar cuento, click con evaluate
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Comenzar cuento') || b.textContent.includes('Escuchar'));
        if (btn) btn.click();
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `04_st2_cuento_${vp.name}.png`) });
      await checkMetrics('Estacion 2 Cuento');

      // Cerrar y avanzar a Estación 3 con ArrowRight
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);

      // 5. Estación 3: abrir con Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `05_st3_${vp.name}.png`) });
      await checkMetrics('Estacion 3');

      // Cerrar y avanzar a Estación 4 con ArrowRight
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);

      // 6. Estación 4: abrir con Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `06_st4_${vp.name}.png`) });
      await checkMetrics('Estacion 4');

      // Cerrar
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(600);
    }

    // 7. Pantalla Final (#meta)
    await page.goto(`http://127.0.0.1:${port}/#meta`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `07_meta_${vp.name}.png`) });
    await checkMetrics('Meta');

    await context.close();
  }

  await browser.close();
  console.log('\n--- Auditoría Playwright completada con éxito ---');
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'metrics.json'), JSON.stringify(auditResults, null, 2));
} catch (e) {
  console.error('Error durante la auditoría:', e);
} finally {
  await server.close();
}
