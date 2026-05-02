import puppeteer from 'puppeteer'

export async function renderPDF(html: string): Promise<Buffer> {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null

  try {
    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      printBackground: true,
    })

    return Buffer.from(pdf)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
