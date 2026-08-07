import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  let browser = null;

  try {
    const browserURL = 'https://iphone-shop-sigma.vercel.app/invoiceMobile.html';

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(browserURL, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '4mm',
        right: '6mm',
        bottom: '4mm',
        left: '6mm',
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');

    res.status(200).send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'PDF generation failed',
      detail: error.message,
    });
  } finally {
    if (browser) await browser.close();
  }
}
