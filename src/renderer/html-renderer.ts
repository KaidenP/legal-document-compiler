import { join as pathjoin } from 'node:path'
import { createHash } from 'node:crypto'
import Handlebars from 'handlebars'

export interface RenderOptions {
  templatePath: string
  cssPath: string
  data: Record<string, unknown>
}

async function loadTemplate(path: string): Promise<string> {
  import(path) // Mark the file for hot reloading
  return await Bun.file(path).text()
}

async function loadCSS(path: string): Promise<string> {
  import(path) // Mark the file for hot reloading
  return await Bun.file(path).text()
}

function registerHelpers(): void {
  Handlebars.registerHelper('eq', (a, b) => a === b)
  Handlebars.registerHelper('and', (a, b) => a && b)
  Handlebars.registerHelper('or', (a, b) => a || b)
  Handlebars.registerHelper('formatDate', (date: Date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  })
  Handlebars.registerHelper('hashId', (id: string) => {
    if (!id) return ''
    const hash = createHash('sha256').update(id).digest('hex').slice(0, 32)
    return hash.replace(/(.{8})/g, '$1-').replace(/-$/, '')
  })
}

export async function renderHTML(options: RenderOptions): Promise<string> {
  const [templateContent, cssContent] = await Promise.all([
    loadTemplate(options.templatePath),
    loadCSS(options.cssPath),
  ])

  registerHelpers()
  const template = Handlebars.compile(templateContent)

  return template({
    ...options.data,
    css: cssContent,
  })
}

export function getTemplatePath(): string {
  return pathjoin(import.meta.dir, '..', 'templates', 'document.hbs')
}

export function getStylePath(): string {
  return pathjoin(import.meta.dir, '..', 'templates', 'stylesheets', 'document.css')
}
