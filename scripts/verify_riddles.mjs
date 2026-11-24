import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5199, host: '127.0.0.1' },
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

await page.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Navegar a estación 4 (4 veces ArrowRight)
for (let i = 0; i < 4; i++) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
}
await page.keyboard.press('Enter');
await page.waitForTimeout(600);

// Revelar adivinanza 1
await page.click('button:has-text("Descubrir respuesta")');
await page.waitForTimeout(500);
await page.screenshot({ path: path.resolve('audit-screenshots/riddle_fix_01.png') });

// Siguiente -> Adivinanza 2 (Las manos)
await page.click('button:has-text("Siguiente adivinanza")');
await page.waitForTimeout(500);
await page.click('button:has-text("Descubrir respuesta")');
await page.waitForTimeout(500);
await page.screenshot({ path: path.resolve('audit-screenshots/riddle_fix_02.png') });

await browser.close();
await server.close();
console.log('Capturas de adivinanzas listas.');

