import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

async function verifyStation3() {
  const server = await createServer({
    server: { port: 5295, host: '127.0.0.1' },
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
    // Mobile landscape como el del usuario (858 x 338)
    const page = await browser.newPage({ viewport: { width: 858, height: 338 } });
    await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Navegar a estación 3: avanzar 3 veces
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);

    await page.screenshot({ path: path.resolve('audit-screenshots/st3_steps_updated.png') });
    console.log('Captura de estación 3 guardada en audit-screenshots/st3_steps_updated.png');
  } finally {
    await browser.close();
    await server.close();
  }
}

verifyStation3().catch(console.error);
