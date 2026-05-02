import { join as pathjoin } from 'node:path'
import { type RouteContext } from 'shell'
import { loadAll } from 'js-yaml'
import { mkdir, rm } from 'node:fs/promises'
import { Document } from '../schemas/document-schema'
import { renderHTML, getTemplatePath, getStylePath } from '../renderer/html-renderer'
import { startWatchServer } from './watch-server'

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
  const watch = params.watch as boolean | undefined

  // Mark the file for hot reloading
  import(inputFile)

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

  // Clear and recreate output directory
  await rm(outdir, { recursive: true, force: true })
  await mkdir(outdir, { recursive: true })

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
      const html = await renderHTML({
        templatePath: getTemplatePath(),
        cssPath: getStylePath(),
        data: validatedDoc,
      })

      // Determine output filename
      const title = validatedDoc.title || 'document'
      const submitter = validatedDoc.properties?.submitted_by || validatedDoc.properties?.author
      const role = submitter?.role || 'Unknown'
      const name = submitter?.name || 'Unknown'
      const date = validatedDoc.properties?.date
        ? validatedDoc.properties.date.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      const fileName = `${title} - ${role} - ${name} - ${date}.html`
      const outFile = pathjoin(outdir, fileName)

      // Write HTML file
      await Bun.write(outFile, html)
      console.log(`Generated: ${outFile}`)
    } catch (error) {
      console.error(`Failed to process document ${i}:`, error)
    }
  }

  if (watch) {
    await startWatchServer(outdir)
  }
}
