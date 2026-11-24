import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const server = await createServer({
    server: { port: 5230, host: '127.0.0.1' },
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
    // 1. Vista móvil exactamente como la del usuario: 858 x 338 horizontal
    const mobilePage = await browser.newPage({
      viewport: { width: 858, height: 338 },
    });
    await mobilePage.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);

    // Navegar a la estación 2 con teclado
    await mobilePage.keyboard.press('ArrowRight');
    await mobilePage.waitForTimeout(300);
    await mobilePage.keyboard.press('ArrowRight');
    await mobilePage.waitForTimeout(400);
    await mobilePage.keyboard.press('Enter');
    await mobilePage.waitForTimeout(800);

    // Portada en mobile
    await mobilePage.screenshot({ path: path.resolve('audit-screenshots/st2_max_cover_mobile.png') });

    // Iniciar cuento (pasa a escena 2)
    await mobilePage.click('button:has-text("Iniciar Cuento Ilustrado")', { force: true });
    await mobilePage.waitForTimeout(800);

    // Escena 2 en mobile
    await mobilePage.screenshot({ path: path.resolve('audit-screenshots/st2_max_scene2_mobile.png') });

    // Siguiente escena (flecha derecha)
    await mobilePage.keyboard.press('ArrowRight');
    await mobilePage.waitForTimeout(800);

    // Escena 3 en mobile
    await mobilePage.screenshot({ path: path.resolve('audit-screenshots/st2_max_scene3_mobile.png') });
    await mobilePage.close();

    // 2. Desktop (1920 x 1080)
    const desktopPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });
    await desktopPage.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(500);

    await desktopPage.keyboard.press('ArrowRight');
    await desktopPage.waitForTimeout(300);
    await desktopPage.keyboard.press('ArrowRight');
    await desktopPage.waitForTimeout(400);
    await desktopPage.keyboard.press('Enter');
    await desktopPage.waitForTimeout(800);

    await desktopPage.screenshot({ path: path.resolve('audit-screenshots/st2_max_cover_desktop.png') });

    await desktopPage.click('button:has-text("Iniciar Cuento Ilustrado")', { force: true });
    await desktopPage.waitForTimeout(800);

    await desktopPage.screenshot({ path: path.resolve('audit-screenshots/st2_max_scene2_desktop.png') });
    await desktopPage.close();

    console.log('Capturas generadas con éxito');
  } finally {
    await browser.close();
    await server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
