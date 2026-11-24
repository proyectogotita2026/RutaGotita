import { createServer } from 'vite';
import { chromium } from 'playwright';

async function verifyIntro() {
  const server = await createServer({
    server: { port: 5250, host: '127.0.0.1' },
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
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Clic forzado en Iniciar la Aventura
    const startBtn = page.locator('button:has-text("¡Iniciar la Aventura!")');
    await startBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const videoSrc = await page.locator('video').getAttribute('src');
    console.log('Video cargado en IntroVideoScreen:', videoSrc);

    await page.screenshot({ path: 'audit-screenshots/new_intro_video.png' });
    console.log('Captura del video guardada en audit-screenshots/new_intro_video.png');
  } finally {
    await browser.close();
    await server.close();
  }
}

verifyIntro().catch(console.error);
