import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function renderPdf(html: string, outputPath: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      displayHeaderFooter: false,
    });
  } finally {
    await browser.close();
  }
}
