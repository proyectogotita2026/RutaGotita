import { createServer } from 'vite';
import { chromium } from 'playwright';
import path from 'path';

async function verifySyncedStory() {
  const server = await createServer({
    server: { port: 5280, host: '127.0.0.1' },
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
    // 1. Mobile (858 x 338 horizontal)
    const mobilePage = await browser.newPage({ viewport: { width: 858, height: 338 } });
    await mobilePage.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);

    // Navegar a estación 2
    await mobilePage.keyboard.press('ArrowRight');
    await mobilePage.waitForTimeout(300);
    await mobilePage.keyboard.press('ArrowRight');
    await mobilePage.waitForTimeout(300);
    await mobilePage.keyboard.press('Enter');
    await mobilePage.waitForTimeout(1000);

    // Captura 1: Portada con botón Iniciar Cuento con Audio
    await mobilePage.screenshot({ path: path.resolve('audit-screenshots/synced_cover_mobile.png') });

    // Iniciar cuento
    await mobilePage.click('button:has-text("Iniciar Cuento")', { force: true });
    await mobilePage.waitForTimeout(800);

    // Captura 2: Primera lámina del cuento reproduciéndose
    await mobilePage.screenshot({ path: path.resolve('audit-screenshots/synced_scene2_mobile.png') });

    // Pausar con Escape
    await mobilePage.keyboard.press('Escape');
    await mobilePage.waitForTimeout(400);

    // Captura 3: Pausado con Escape
    await mobilePage.screenshot({ path: path.resolve('audit-screenshots/synced_paused_mobile.png') });

    await mobilePage.close();

    // 2. Desktop (1440 x 900)
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.goto(`http://127.0.0.1:${port}/#mapa`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(500);

    await desktopPage.keyboard.press('ArrowRight');
    await desktopPage.waitForTimeout(300);
    await desktopPage.keyboard.press('ArrowRight');
    await desktopPage.waitForTimeout(300);
    await desktopPage.keyboard.press('Enter');
    await desktopPage.waitForTimeout(800);

    await desktopPage.click('button:has-text("Iniciar Cuento")', { force: true });
    await desktopPage.waitForTimeout(800);

    await desktopPage.screenshot({ path: path.resolve('audit-screenshots/synced_scene2_desktop.png') });
    await desktopPage.close();

    console.log('Capturas del cuento sincronizado generadas con éxito');
  } finally {
    await browser.close();
    await server.close();
  }
}

verifySyncedStory().catch(console.error);
