import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5190, host: '127.0.0.1' },
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

// Avanzar a estación 2
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(600);
// Abrir estación 2 con Enter
await page.keyboard.press('Enter');
await page.waitForTimeout(800);

await page.screenshot({ path: path.resolve('audit-screenshots/st2_detail_intro.png') });

// Click Comenzar Cuento
const playBtn = page.locator('button:has-text("Comenzar cuento"), button:has-text("¡Comenzar cuento!")').first();
if (await playBtn.isVisible()) {
  await playBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.resolve('audit-screenshots/st2_detail_scene1.png') });

  // Avanzar a siguiente escena
  const nextBtn = page.locator('button:has-text("Siguiente"), button:has-text("Continuar")').first();
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve('audit-screenshots/st2_detail_scene2.png') });
  }
}

await browser.close();
await server.close();
console.log('Capturas de Estación 2 listas.');

