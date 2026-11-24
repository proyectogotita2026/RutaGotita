import { chromium } from 'playwright';
import path from 'path';

async function cropMascot() {
  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Abrir la imagen capturada map_st2_viajera.png en el browser
  await page.goto(`file://${path.resolve('audit-screenshots/map_st2_viajera.png').replace(/\\/g, '/')}`);
  await page.waitForTimeout(500);

  // Coordenadas aproximadas de la estación 2 en 1440x900
  // x: 65%, y: 35% -> x: ~936, y: ~315
  await page.screenshot({
    path: path.resolve('audit-screenshots/crop_st2_viajera.png'),
    clip: { x: 750, y: 150, width: 350, height: 350 },
  });

  console.log('Recorte guardado en audit-screenshots/crop_st2_viajera.png');
  await browser.close();
}

cropMascot().catch(console.error);
