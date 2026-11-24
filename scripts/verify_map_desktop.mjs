import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5218, host: '127.0.0.1' },
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

const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});

await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: path.resolve('audit-screenshots/map_desktop_scaled_gotita.png') });

await browser.close();
await server.close();
console.log('Captura de mapa desktop completada.');

