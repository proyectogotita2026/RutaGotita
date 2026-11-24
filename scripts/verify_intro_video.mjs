import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5208, host: '127.0.0.1' },
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
  viewport: { width: 844, height: 390 },
});

// 1. Portada
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// 2. Clic en Iniciar la Aventura con force: true
const startBtn = page.locator('button:has-text("Iniciar la Aventura")').first();
await startBtn.click({ force: true });
await page.waitForTimeout(1000);

// 3. Captura de la pantalla de video de bienvenida
await page.screenshot({ path: path.resolve('audit-screenshots/intro_video_screen.png') });

// 4. Clic en "Ir al mapa"
const skipBtn = page.locator('button:has-text("Ir al mapa")').first();
await skipBtn.click({ force: true });
await page.waitForTimeout(1000);

// 5. Captura del mapa interactivo
await page.screenshot({ path: path.resolve('audit-screenshots/after_video_map.png') });

await browser.close();
await server.close();
console.log('Verificación de flujo de video completada.');
