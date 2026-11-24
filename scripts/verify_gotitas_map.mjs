import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

async function verifyGotitas() {
  const server = await createServer({
    server: { port: 5245, host: '127.0.0.1' },
    clearScreen: false,
  });
  await server.listen();
  const port = server.config.server.port;

  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Estación 0: Inicio (Gotita Principal)
    await page.screenshot({ path: path.resolve('audit-screenshots/map_st0_principal.png') });

    // 2. Avanzar a Estación 1: Gotita Curiosa
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.resolve('audit-screenshots/map_st1_curiosa.png') });

    // 3. Avanzar a Estación 2: Gotita Viajera
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.resolve('audit-screenshots/map_st2_viajera.png') });

    // 4. Avanzar a Estación 3: Gotita Valiente
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.resolve('audit-screenshots/map_st3_valiente.png') });

    // 5. Avanzar a Estación 4: Gotita Generosa
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.resolve('audit-screenshots/map_st4_generosa.png') });

    // 6. Avanzar a Meta
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.resolve('audit-screenshots/map_st5_meta.png') });

    console.log('Capturas de las 5 estaciones generadas con éxito');
  } finally {
    await browser.close();
    await server.close();
  }
}

verifyGotitas().catch((err) => {
  console.error(err);
  process.exit(1);
});
