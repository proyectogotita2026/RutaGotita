import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5192, host: '127.0.0.1' },
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

await page.goto(`http://127.0.0.1:${port}/#mapa`);
await page.waitForTimeout(600);

// Avanzar 2 veces a estación 2: La Gotita Viajera
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(500);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(700);

// Abrir estación 2 con Enter
await page.keyboard.press('Enter');
await page.waitForTimeout(800);
await page.screenshot({ path: path.resolve('audit-screenshots/st2_real_intro.png') });

// Click Comenzar cuento
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Comenzar cuento') || b.textContent.includes('Escuchar'));
  if (btn) btn.click();
});
await page.waitForTimeout(1000);
await page.screenshot({ path: path.resolve('audit-screenshots/st2_real_cuento_slide1.png') });

// Click botón Siguiente lámina
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Siguiente escena') || b.textContent.includes('Siguiente') || b.textContent.includes('Continuar'));
  if (btn) btn.click();
});
await page.waitForTimeout(800);
await page.screenshot({ path: path.resolve('audit-screenshots/st2_real_cuento_slide2.png') });

// Cerrar estación 2 y avanzar a estación 3
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(700);
await page.keyboard.press('Enter');
await page.waitForTimeout(800);
await page.screenshot({ path: path.resolve('audit-screenshots/st3_real.png') });

// Cerrar estación 3 y avanzar a estación 4
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(700);
await page.keyboard.press('Enter');
await page.waitForTimeout(800);
await page.screenshot({ path: path.resolve('audit-screenshots/st4_real.png') });

await browser.close();
await server.close();
console.log('Capturas de Estaciones 2, 3 y 4 listas.');

