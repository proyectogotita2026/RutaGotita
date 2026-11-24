import { preview } from 'vite';
import { chromium } from 'playwright';

async function check() {
  const server = await preview({ preview: { port: 4174 } });
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:4174/#mapa', { waitUntil: 'networkidle' });
    
    // Avanzar a Estación 2
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    const mascotBox = await page.locator('img[alt*="Gotita"], img[alt*="Estación"]').first().boundingBox();
    console.log('Mascot bounding box:', mascotBox);

    if (mascotBox) {
      await page.screenshot({
        path: 'audit-screenshots/mascot_st2_live.png',
        clip: {
          x: Math.max(0, mascotBox.x - 40),
          y: Math.max(0, mascotBox.y - 70),
          width: mascotBox.width + 80,
          height: mascotBox.height + 90,
        },
      });
      console.log('Screenshot mascota en vivo guardada en audit-screenshots/mascot_st2_live.png');
    }
  } finally {
    await browser.close();
    await new Promise((r) => server.httpServer.close(r));
  }
}

check().catch(console.error);
