import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

async function testGota() {
  const server = await createServer({
    server: { port: 5240, host: '127.0.0.1' },
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
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    console.log('Mapa cargado');
  } finally {
    await browser.close();
    await server.close();
  }
}

testGota().catch(console.error);
