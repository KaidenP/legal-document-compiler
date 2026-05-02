import { readdir } from 'node:fs/promises'
import { join as pathjoin } from 'node:path'
import Handlebars from 'handlebars'

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.pdf': 'application/pdf',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
}

function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.'))
  return MIME_TYPES[ext] || 'application/octet-stream'
}

async function loadTemplate(path: string): Promise<string> {
  import(path)
  return await Bun.file(path).text()
}

async function renderIndexHTML(
  documents: Array<{ name: string; html?: string; pdf?: string }>
): Promise<string> {
  const templatePath = pathjoin(import.meta.dir, '..', 'templates', 'viewer.hbs')
  const templateContent = await loadTemplate(templatePath)
  const template = Handlebars.compile(templateContent)

  return template({ documents })
}

export async function startWatchServer(outdir: string, port: number = 3000): Promise<void> {
  const serverStartTime = Date.now()

  const getDocuments = async (): Promise<
    Array<{ name: string; html?: string; pdf?: string }>
  > => {
    try {
      const files = await readdir(outdir)
      const docMap = new Map<string, { name: string; html?: string; pdf?: string }>()

      files
        .filter((f) => f.endsWith('.html') || f.endsWith('.pdf'))
        .sort()
        .forEach((f) => {
          const ext = f.endsWith('.pdf') ? '.pdf' : '.html'
          const baseName = f.slice(0, -(ext.length))

          if (!docMap.has(baseName)) {
            docMap.set(baseName, { name: baseName })
          }

          const doc = docMap.get(baseName)!
          if (ext === '.pdf') {
            doc.pdf = `./${f}`
          } else {
            doc.html = `./${f}`
          }
        })

      return Array.from(docMap.values())
    } catch {
      return []
    }
  }

  Bun.serve({
    port,
    async fetch(request) {
      const url = new URL(request.url)

      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(
          JSON.stringify({ startTime: serverStartTime }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      // Index page
      if (url.pathname === '/' || url.pathname === '/index.html') {
        const documents = await getDocuments()
        const html = await renderIndexHTML(documents)
        return new Response(html, {
          headers: { 'Content-Type': 'text/html' },
        })
      }

      // Serve viewer CSS
      if (url.pathname === '/viewer.css') {
        const cssPath = pathjoin(import.meta.dir, '..', 'templates', 'stylesheets', 'viewer.css')
        try {
          const file = Bun.file(cssPath)
          if (await file.exists()) {
            return new Response(file, {
              headers: { 'Content-Type': 'text/css' },
            })
          }
        } catch {
          // File not found
        }
        return new Response('Not Found', { status: 404 })
      }

      // Serve files from output directory
      const filePath = pathjoin(outdir, decodeURIComponent(url.pathname.slice(1)))

      // Prevent directory traversal
      if (!filePath.startsWith(outdir)) {
        return new Response('Forbidden', { status: 403 })
      }

      try {
        const file = Bun.file(filePath)
        const exists = await file.exists()

        if (exists) {
          return new Response(file, {
            headers: {
              'Content-Type': getMimeType(filePath),
              'Cache-Control': 'no-cache',
            },
          })
        }
      } catch {
        // File not found
      }

      return new Response('Not Found', { status: 404 })
    },
  })

  console.log(`\n📄 Document viewer: http://localhost:${port}`)
  console.log(`📁 Serving files from: ${outdir}\n`)
}
