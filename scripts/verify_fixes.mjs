import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5195, host: '127.0.0.1' },
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
  viewport: { width: 732, height: 352 },
});

// 1. Mapa interactivo
await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: path.resolve('audit-screenshots/fixed_01_map.png') });

// 2. Estación 3: La Gotita Valiente
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(400);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(400);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(600);
await page.keyboard.press('Enter');
await page.waitForTimeout(600);
await page.screenshot({ path: path.resolve('audit-screenshots/fixed_02_st3.png') });

// 3. Estación 4: La Gotita Generosa
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(600);
await page.keyboard.press('Enter');
await page.waitForTimeout(600);
await page.screenshot({ path: path.resolve('audit-screenshots/fixed_03_st4.png') });

// 4. La Meta
await page.goto(`http://127.0.0.1:${port}/#meta`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: path.resolve('audit-screenshots/fixed_04_meta.png') });

await browser.close();
await server.close();
console.log('Capturas de validación final completadas.');

