const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Absolute path + file:// протокол
  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath, { waitUntil: 'networkidle2' });

  await page.setViewport({ width: 1500, height: 2400 });

  // Бүх хуудасны screenshot авах
  await page.screenshot({
    path: 'output222.png',
    fullPage: false
  });

  await browser.close();
})();
