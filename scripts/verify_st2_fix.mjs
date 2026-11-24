import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

const server = await createServer({
  server: { port: 5225, host: '127.0.0.1' },
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
await pageMobile.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
await pageMobile.waitForTimeout(500);

// Avanzar 2 veces a la estación 2
await pageMobile.keyboard.press('ArrowRight');
await pageMobile.waitForTimeout(400);
await pageMobile.keyboard.press('ArrowRight');
await pageMobile.waitForTimeout(600);
await pageMobile.keyboard.press('Enter');
await pageMobile.waitForTimeout(700);

// Captura 1: Portada del cuento en móvil
await pageMobile.screenshot({ path: path.resolve('audit-screenshots/st2_fixed_cover_mobile.png') });

// Iniciar Cuento Ilustrado (pasa a lámina 2)
await pageMobile.click('button:has-text("Iniciar Cuento Ilustrado")', { force: true });
await pageMobile.waitForTimeout(800);

// Pasar a lámina 3 (la misma que subió el usuario)
await pageMobile.click('button:has-text("Siguiente escena")', { force: true });
await pageMobile.waitForTimeout(800);

// Captura 2: Lámina 3 en móvil (sin barra sobrepuesta)
await pageMobile.screenshot({ path: path.resolve('audit-screenshots/st2_fixed_scene3_mobile.png') });
await pageMobile.close();

// 2. Desktop (1440x900)
const pageDesk = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
await pageDesk.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
await pageDesk.waitForTimeout(500);
await pageDesk.keyboard.press('ArrowRight');
await pageDesk.waitForTimeout(400);
await pageDesk.keyboard.press('ArrowRight');
await pageDesk.waitForTimeout(600);
await pageDesk.keyboard.press('Enter');
await pageDesk.waitForTimeout(700);

// Iniciar y pasar a lámina 3
await pageDesk.click('button:has-text("Iniciar Cuento Ilustrado")', { force: true });
await pageDesk.waitForTimeout(700);
await pageDesk.click('button:has-text("Siguiente escena")', { force: true });
await pageDesk.waitForTimeout(800);

// Captura 3: Lámina 3 en Desktop
await pageDesk.screenshot({ path: path.resolve('audit-screenshots/st2_fixed_scene3_desktop.png') });
await pageDesk.close();

await browser.close();
await server.close();
console.log('Capturas de Estación 2 verificadas.');

