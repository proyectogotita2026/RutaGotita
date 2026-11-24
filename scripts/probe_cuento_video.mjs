import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const videoPath = path.resolve('src/assets/images/escenasCuentoAudio/CuentoNarrado.mp4');

const server = http.createServer((req, res) => {
  const stat = fs.statSync(videoPath);
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size,
  });
  fs.createReadStream(videoPath).pipe(res);
});

server.listen(5260, '127.0.0.1', async () => {
  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.setContent(`<video id="v" src="http://127.0.0.1:5260" preload="metadata"></video>`);
  
  const meta = await page.evaluate(async () => {
    const v = document.getElementById('v');
    return new Promise((resolve) => {
      v.onloadedmetadata = () => {
        resolve({
          duration: v.duration,
          width: v.videoWidth,
          height: v.videoHeight,
        });
      };
      v.onerror = (e) => resolve({ error: 'error' });
    });
  });

  console.log('Video Meta:', meta);
  await browser.close();
  server.close();
});
