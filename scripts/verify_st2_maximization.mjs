import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Vista celular como la del usuario (858 x 338 horizontal)
  const mobileContext = await browser.newContext({
    viewport: { width: 858, height: 338 },
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/#mapa');
  await mobilePage.waitForTimeout(1000);

  // Click en Estación 2
  const station2Btn = mobilePage.locator('button:has-text("2. Estación"), button:has-text("La Gotita Viajera")').first();
  await station2Btn.click({ force: true });
  await mobilePage.waitForTimeout(1200);

  // Portada en mobile
  await mobilePage.screenshot({ path: 'audit-screenshots/st2_max_cover_mobile.png' });

  // Iniciar cuento -> Escena 2
  const startBtn = mobilePage.locator('button:has-text("Iniciar Cuento")');
  await startBtn.click({ force: true });
  await mobilePage.waitForTimeout(800);

  // Captura escena 2 en mobile
  await mobilePage.screenshot({ path: 'audit-screenshots/st2_max_scene2_mobile.png' });

  // Siguiente -> Escena 3
  const nextBtn = mobilePage.locator('button[aria-label="Avanzar a la siguiente escena"]');
  await nextBtn.click({ force: true });
  await mobilePage.waitForTimeout(800);

  // Captura escena 3 en mobile
  await mobilePage.screenshot({ path: 'audit-screenshots/st2_max_scene3_mobile.png' });

  await mobileContext.close();

  // 2. Vista Desktop (1920 x 1080)
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:5173/#mapa');
  await desktopPage.waitForTimeout(1000);

  const dStation2Btn = desktopPage.locator('button:has-text("2. Estación"), button:has-text("La Gotita Viajera")').first();
  await dStation2Btn.click({ force: true });
  await desktopPage.waitForTimeout(1200);

  // Portada en desktop
  await desktopPage.screenshot({ path: 'audit-screenshots/st2_max_cover_desktop.png' });

  // Escena 2 en desktop
  const dStartBtn = desktopPage.locator('button:has-text("Iniciar Cuento")');
  await dStartBtn.click({ force: true });
  await desktopPage.waitForTimeout(800);

  await desktopPage.screenshot({ path: 'audit-screenshots/st2_max_scene2_desktop.png' });

  await desktopContext.close();
  await browser.close();
  console.log('Verificación exitosa: capturas guardadas en audit-screenshots/');
}

verify().catch(console.error);

