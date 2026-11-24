import { chromium } from 'playwright';
import path from 'path';

async function checkPixel() {
  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage();
  // Cargar una de las imágenes en un canvas y revisar píxeles de las esquinas
  const html = `
    <html>
      <body style="background: green;">
        <img id="img" src="file://${path.resolve('src/assets/images/gotaviajera.jpeg').replace(/\\/g, '/')}" />
        <canvas id="c"></canvas>
      </body>
    </html>
  `;
  await page.setContent(html);
  await page.waitForTimeout(500);
  const cornerColor = await page.evaluate(() => {
    const img = document.getElementById('img');
    const c = document.getElementById('c');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const pixel = ctx.getImageData(5, 5, 1, 1).data;
    return `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]})`;
  });
  console.log('Color en la esquina superior izquierda de gotaviajera.jpeg:', cornerColor);
  await browser.close();
}

checkPixel().catch(console.error);
