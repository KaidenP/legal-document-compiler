import { join as pathjoin, basename } from 'node:path'
import { type RouteContext } from 'shell'
import { readdir } from 'node:fs/promises'
import { statSync } from 'node:fs'
import compileDoc from './compile-doc'

const compiledFiles = new Set<string>()
let debounceTimer: NodeJS.Timeout | null = null
let lastCompileTime = Date.now()

async function compileDocuments(inputFile: string, outdir: string): Promise<void> {
  try {
    await compileDoc({ params: { file: inputFile, outdir } } as unknown as RouteContext)
    // Track generated files for dev server
    try {
      const entries = await readdir(outdir)
      for (const entry of entries) {
        if (entry.endsWith('.html')) {
          compiledFiles.add(pathjoin(outdir, entry))
        }
      }
    } catch {}
    lastCompileTime = Date.now()
    console.log(`✓ Generated documents at ${new Date().toLocaleTimeString()}`)
  } catch (error) {
    console.error(`Compilation failed:`, error)
  }
}

export default async function ({ params }: RouteContext) {
  const inputFile = params.file as string
  const outdir = (params.outdir as string) || 'out'
  const port = (params.port as number) || 5173
  const noServer = params['no-server'] === 'true'

  console.log(`👀 Watching for changes...`)
  console.log(`📝 Input: ${inputFile}`)
  console.log(`📂 Output: ${outdir}`)

  // Initial compile
  await compileDocuments(inputFile, outdir)

  // Helper to recursively find all files in a directory
  async function findFiles(dir: string, extensions: string[] = []): Promise<string[]> {
    const files: string[] = []

    try {
      const entries = await readdir(dir, { recursive: true })
      for (const entry of entries) {
        const fullPath = pathjoin(dir, entry as string)
        if (extensions.length === 0 || extensions.some(ext => entry.toString().endsWith(ext))) {
          try {
            if (statSync(fullPath).isFile()) {
              files.push(fullPath)
            }
          } catch {}
        }
      }
    } catch {}

    return files
  }

  // Track file modification times for polling
  const fileModTimes = new Map<string, number>()

  // Helper to check and watch files by polling
  const initializeFileTracking = async () => {
    const templatesDir = pathjoin(__dirname, 'templates')

    // Track input file
    try {
      const stat = statSync(inputFile)
      fileModTimes.set(inputFile, stat.mtimeMs)
    } catch {}

    // Track template files
    const templateFiles = await findFiles(templatesDir, ['.hbs', '.css'])
    for (const file of templateFiles) {
      try {
        const stat = statSync(file)
        fileModTimes.set(file, stat.mtimeMs)
      } catch {}
    }
  }

  // Initialize tracking
  await initializeFileTracking()

  // Poll for file changes
  setInterval(async () => {
    let hasChanges = false
    const filesToCheck = Array.from(fileModTimes.keys())

    for (const filePath of filesToCheck) {
      try {
        const stat = statSync(filePath)
        const lastMtime = fileModTimes.get(filePath) || 0

        if (stat.mtimeMs > lastMtime) {
          console.log(`📄 Detected change: ${basename(filePath)}`)
          fileModTimes.set(filePath, stat.mtimeMs)
          hasChanges = true
        }
      } catch {}
    }

    // Also check for new files
    try {
      const templatesDir = pathjoin(__dirname, 'templates')
      const templateFiles = await findFiles(templatesDir, ['.hbs', '.css'])

      for (const file of templateFiles) {
        if (!fileModTimes.has(file)) {
          try {
            const stat = statSync(file)
            fileModTimes.set(file, stat.mtimeMs)
            console.log(`📄 New file detected: ${basename(file)}`)
            hasChanges = true
          } catch {}
        }
      }
    } catch {}

    if (hasChanges) {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(async () => {
        await compileDocuments(inputFile, outdir)
      }, 300)
    }
  }, 1000)

  // Simple dev server with live reload
  if (!noServer) {
    const clientScript = `
      <script>
        (function() {
          let lastReloadTime = Date.now();
          setInterval(() => {
            fetch(window.location.href + '?_t=' + lastReloadTime, { method: 'HEAD', cache: 'no-store' })
              .then(r => {
                const compileTime = parseInt(r.headers.get('x-compile-time') || '0');
                if (compileTime > lastReloadTime) {
                  lastReloadTime = compileTime;
                  window.location.reload();
                }
              })
              .catch(() => {});
          }, 1000);
        })();
      </script>
    `

    const server = Bun.serve({
      port,
      async fetch(request) {
        const url = new URL(request.url)

        // Serve files from outdir
        if (url.pathname === '/' || url.pathname === '') {
          const firstFile = Array.from(compiledFiles)[0]
          if (firstFile) {
            const content = await Bun.file(firstFile).text()
            const withScript = content.replace('</body>', clientScript + '</body>')
            return new Response(withScript, {
              headers: { 'content-type': 'text/html', 'x-compile-time': lastCompileTime.toString() },
            })
          }
          return new Response('No documents compiled yet', { status: 404 })
        }

        // Serve other HTML files
        const filePath = pathjoin(outdir, decodeURIComponent(url.pathname.slice(1)))
        try {
          const file = Bun.file(filePath)
          if (await file.exists()) {
            const content = await file.text()
            const withScript = content.replace('</body>', clientScript + '</body>')
            return new Response(withScript, {
              headers: { 'content-type': 'text/html', 'x-compile-time': lastCompileTime.toString() },
            })
          }
        } catch {}

        return new Response('Not found', { status: 404 })
      },
    })

    console.log(`🚀 Dev server running at http://localhost:${port}`)
  }

  console.log(`Press Ctrl+C to stop`)
}
