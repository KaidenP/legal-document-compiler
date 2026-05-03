import puppeteer from 'puppeteer'

export class PDFRenderer {
  private browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null

  async init(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: true })
    }
  }

  async renderPDF(html: string): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('PDFRenderer not initialized. Call init() first.')
    }

    const page = await this.browser.newPage()
    try {
      await page.setContent(html, { waitUntil: 'networkidle0' })

      const pdf = await page.pdf({
        format: 'A4',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        printBackground: true,
      })

      return Buffer.from(pdf)
    } finally {
      await page.close()
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

// Export a singleton instance for convenience
export const pdfRenderer = new PDFRenderer()
