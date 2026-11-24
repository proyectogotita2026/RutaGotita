import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const IMAGES = [
  'gotaprincipal',
  'gotacuriosa',
  'gotaviajera',
  'gotavaliente',
  'gotagenerosa',
];

async function removeBackgrounds() {
  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage();

  for (const name of IMAGES) {
    const inputPath = path.resolve(`src/assets/images/${name}.jpeg`);
    const outputPath = path.resolve(`src/assets/images/${name}.png`);

    if (!fs.existsSync(inputPath)) {
      console.log(`No encontrado: ${inputPath}`);
      continue;
    }

    const imgBase64 = fs.readFileSync(inputPath).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${imgBase64}`;

    const pngBase64 = await page.evaluate(async (dataUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, width, height);
          const data = imgData.data;

          // Función para saber si un píxel es "fondo claro / blanco"
          // La mayoría de los fondos de estas ilustraciones son blanco puro (> 240) o gris muy claro
          const isBackgroundPixel = (r, g, b) => {
            // Blanco o casi blanco
            if (r > 230 && g > 230 && b > 230) return true;
            // También verificar cercanía de grises claros (diferencia mínima entre canales y brillo alto)
            const brightness = (r + g + b) / 3;
            const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
            return brightness > 220 && diff < 15;
          };

          // Flood Fill BFS desde los bordes para NO tocar el blanco interior del personaje
          const visited = new Uint8Array(width * height);
          const queue = [];

          // Sembrar todos los píxeles del borde exterior
          for (let x = 0; x < width; x++) {
            // borde superior
            queue.push(x, 0);
            visited[0 * width + x] = 1;
            // borde inferior
            queue.push(x, height - 1);
            visited[(height - 1) * width + x] = 1;
          }
          for (let y = 0; y < height; y++) {
            // borde izquierdo
            queue.push(0, y);
            visited[y * width + 0] = 1;
            // borde derecho
            queue.push(width - 1, y);
            visited[y * width + (width - 1)] = 1;
          }

          let head = 0;
          const toMakeTransparent = new Uint8Array(width * height);

          while (head < queue.length) {
            const cx = queue[head++];
            const cy = queue[head++];
            const idx = (cy * width + cx) * 4;

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            if (isBackgroundPixel(r, g, b)) {
              toMakeTransparent[cy * width + cx] = 1;

              // Revisar los 4 vecinos
              const neighbors = [
                [cx + 1, cy],
                [cx - 1, cy],
                [cx, cy + 1],
                [cx, cy - 1],
              ];

              for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const nPos = ny * width + nx;
                  if (!visited[nPos]) {
                    visited[nPos] = 1;
                    queue.push(nx, ny);
                  }
                }
              }
            }
          }

          // Aplicar transparencia con suavizado de bordes (anti-aliasing / feathering)
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const pos = y * width + x;
              const idx = pos * 4;

              if (toMakeTransparent[pos] === 1) {
                // Totalmente transparente
                data[idx + 3] = 0;
              } else {
                // Verificar si es un píxel en el borde exterior del personaje para suavizar
                let hasTransparentNeighbor = false;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                if (r > 200 && g > 200 && b > 200) {
                  for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                      const nx = x + dx;
                      const ny = y + dy;
                      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        if (toMakeTransparent[ny * width + nx] === 1) {
                          hasTransparentNeighbor = true;
                          break;
                        }
                      }
                    }
                    if (hasTransparentNeighbor) break;
                  }

                  if (hasTransparentNeighbor) {
                    // Gradiente suave de transparencia para que no quede halo blanco
                    const brightness = (r + g + b) / 3;
                    const factor = (255 - brightness) / 55; // 0 en 255, 1 en 200
                    data[idx + 3] = Math.max(0, Math.min(255, Math.round(factor * 255)));
                  }
                }
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png').split(',')[1]);
        };
        img.src = dataUrl;
      });
    }, dataUrl);

    fs.writeFileSync(outputPath, Buffer.from(pngBase64, 'base64'));
    console.log(`Guardado con fondo transparente: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
  }

  await browser.close();
}

removeBackgrounds().catch((err) => {
  console.error(err);
  process.exit(1);
});
