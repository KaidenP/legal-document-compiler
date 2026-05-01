import { join as pathjoin, basename } from 'node:path'
import { type RouteContext } from 'shell'
import { loadAll } from 'js-yaml'
import { mkdir } from 'node:fs/promises'
import Handlebars from 'handlebars'
import { Document } from './inputSchema'

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

function deepMerge(target: unknown, source: unknown): unknown {
  if (!isObject(source)) return source
  if (!isObject(target)) return source

  const result = { ...target }
  for (const key in source) {
    if (key in source) {
      result[key] = isObject(source[key]) && isObject(target[key])
        ? deepMerge(target[key], source[key])
        : source[key]
    }
  }
  return result
}

export default async function ({ params }: RouteContext) {
  const inputFile = params.file as string
  const outdir = (params.outdir as string) || 'out'

  // Read and parse YAML file
  const yamlContent = await Bun.file(inputFile).text()
  const rawDocs = loadAll(yamlContent) as unknown[]

  // Extract Globals if first document is type 'globals'
  let globals: Record<string, unknown> | null = null
  let docs = rawDocs

  if (rawDocs.length > 0 && typeof rawDocs[0] === 'object' && rawDocs[0] !== null) {
    const firstDoc = rawDocs[0] as Record<string, unknown>
    if (firstDoc.type === 'globals') {
      globals = firstDoc
      docs = rawDocs.slice(1)
    }
  }

  // Ensure output directory exists
  await mkdir(outdir, { recursive: true }).catch(() => { })

  // Load CSS file for embedding in template
  const cssContent = await Bun.file(pathjoin(__dirname, 'templates', 'style', 'document.css')).text()

  // Load and compile template
  const templateContent = await Bun.file(pathjoin(__dirname, 'templates', 'document.hbs')).text()

  // Register custom helpers
  Handlebars.registerHelper('eq', (a, b) => a === b)
  Handlebars.registerHelper('formatDate', (date: Date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  })

  const template = Handlebars.compile(templateContent)

  // Process each document
  for (let i = 0; i < docs.length; i++) {
    const docData = docs[i]

    try {
      // Merge globals defaults into document
      let mergedData = docData
      if (globals && typeof docData === 'object' && docData !== null) {
        mergedData = deepMerge(globals, docData)
        // console.log('Merged data:', JSON.stringify(mergedData, null, 2))
      }

      // Validate document structure
      const validatedDoc = Document.parse(mergedData)

      // Render HTML with CSS embedded
      const templateData = {
        ...validatedDoc,
        css: cssContent,
      }
      const html = template(templateData)

      // Determine output filename
      const baseName = basename(inputFile, '.yaml')
      const outFile = pathjoin(outdir, `${baseName}-${i}.html`)

      // Write HTML file
      await Bun.write(outFile, html)
      console.log(`Generated: ${outFile}`)
    } catch (error) {
      console.error(`Failed to process document ${i}:`, error)
    }
  }
}