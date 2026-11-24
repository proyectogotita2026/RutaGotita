import { chromium } from 'playwright';
import path from 'path';

async function checkVideo() {
  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  const filePath = path.resolve('src/assets/images/escenasCuentoAudio/CuentoNarrado.mp4').replace(/\\/g, '/');
  
  await page.setContent(`
    <video id="v" src="file://${filePath}"></video>
  `);
  
  const metadata = await page.evaluate(async () => {
    const v = document.getElementById('v');
    return new Promise((resolve) => {
      v.onloadedmetadata = () => {
        resolve({
          duration: v.duration,
          videoWidth: v.videoWidth,
          videoHeight: v.videoHeight,
        });
      };
      v.onerror = (e) => resolve({ error: 'error loading video' });
      setTimeout(() => resolve({ timeout: true }), 3000);
    });
  });
  
  console.log('Video metadata:', metadata);
  await browser.close();
}

checkVideo().catch(console.error);
