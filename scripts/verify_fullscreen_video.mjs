import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5212, host: '127.0.0.1' },
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

// 1. Móvil Horizontal (732x352)
const pageMobile = await browser.newPage({
  viewport: { width: 732, height: 352 },
});
await pageMobile.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
await pageMobile.waitForTimeout(500);
const startBtn = pageMobile.locator('button:has-text("Iniciar la Aventura")').first();
await startBtn.click({ force: true });
await pageMobile.waitForTimeout(1000);
await pageMobile.screenshot({ path: path.resolve('audit-screenshots/fullscreen_video_mobile.png') });
await pageMobile.close();

// 2. Desktop (1440x900)
const pageDesktop = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
await pageDesktop.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
await pageDesktop.waitForTimeout(500);
const startBtnDesk = pageDesktop.locator('button:has-text("Iniciar la Aventura")').first();
await startBtnDesk.click({ force: true });
await pageDesktop.waitForTimeout(1000);
await pageDesktop.screenshot({ path: path.resolve('audit-screenshots/fullscreen_video_desktop.png') });
await pageDesktop.close();

await browser.close();
await server.close();
console.log('Capturas de pantalla completa listas.');

