import { join as pathjoin, resolve, dirname } from 'node:path'
import { type RouteContext } from 'shell'
import { load } from 'js-yaml'
import { mkdir, rm } from 'node:fs/promises'
import { Document, Globals } from '../schemas/document-schema'
import { renderHTML, getTemplatePath, getStylePath } from '../renderer/html-renderer'
import { renderPDF } from '../renderer/pdf-renderer'
import { startWatchServer } from './watch-server'
import { numberParagraphs } from './preprocess'

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
  const buildPDF = params.pdf !== false
  const buildHTML = params.html !== false

  // Ensure inputFile is absolute
  const absInputFile = resolve(inputFile)

  // Mark the globals file for hot reloading
  import(absInputFile)

  // Read and parse globals YAML file
  const globalsContent = await Bun.file(absInputFile).text()
  const globalsData = load(globalsContent)
  const globals = Globals.parse(globalsData)

  // Resolve document paths relative to the globals file directory
  const baseDir = dirname(absInputFile)
  const docPaths = globals.documents || []

  // Load all document files
  const docs = await Promise.all(
    docPaths.map(async (docPath) => {
      const absPath = resolve(baseDir, docPath)

      // Mark the file for hot reloading
      import(absPath)

      const docContent = await Bun.file(absPath).text()
      return load(docContent)
    })
  )

  // Clear and recreate output directory
  await rm(outdir, { recursive: true, force: true })
  await mkdir(outdir, { recursive: true })

  // Process each document
  for (let i = 0; i < docs.length; i++) {
    const docData = docs[i]

    try {
      // Merge globals defaults into document
      let mergedData = docData
      if (typeof docData === 'object' && docData !== null) {
        mergedData = deepMerge(globals, docData)
        // console.log('Merged data:', JSON.stringify(mergedData, null, 2))
      }

      // Validate document structure
      let validatedDoc = Document.parse(mergedData)

      // Preprocess: number paragraphs
      validatedDoc = numberParagraphs(validatedDoc)

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
      const baseFileName = `${title} - ${role} - ${name} - ${date}`

      // Write HTML file
      if (buildHTML) {
        const htmlFile = pathjoin(outdir, `${baseFileName}.html`)
        await Bun.write(htmlFile, html)
        console.log(`Generated: ${htmlFile}`)
      }

      // Generate and write PDF file
      if (buildPDF) {
        const pdf = await renderPDF(html)
        const pdfFile = pathjoin(outdir, `${baseFileName}.pdf`)
        await Bun.write(pdfFile, pdf)
        console.log(`Generated: ${pdfFile}`)
      }
    } catch (error) {
      console.error(`Failed to process document ${i}:`, error)
    }
  }

  if (watch) {
    await startWatchServer(outdir)
  }
}
