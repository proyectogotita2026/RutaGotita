import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

async function verifyStartModal() {
  const server = await createServer({
    server: { port: 5290, host: '127.0.0.1' },
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
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Abrir modal de inicio (estación 0) presionando Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.resolve('audit-screenshots/start_modal_clean.png') });
    console.log('Captura del modal de inicio guardada en audit-screenshots/start_modal_clean.png');
  } finally {
    await browser.close();
    await server.close();
  }
}

verifyStartModal().catch(console.error);
