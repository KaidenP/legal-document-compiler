import { join as pathjoin } from 'node:path'
import { type RouteContext } from 'shell'
import { LoremIpsum } from 'lorem-ipsum'
import { dump } from 'js-yaml'

import { Document } from '../schemas/document-schema'

const MIN_DATE = new Date(`1900-01-01T00:00:00Z`)
const MAX_DATE = new Date(`2100-01-01T00:00:00Z`)
function randomDate(min = MIN_DATE, max = MAX_DATE) {
  return new Date(
    min.getTime() + Math.random() * (max.getTime() - min.getTime())
  )
}

function titleCase(str: string) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function randInt(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomCaseNumber() {
  const randomDigits = (length: number) => String(randInt(0, Math.pow(10, length) - 1)).padStart(length, '0')

  return `FC-${randomDigits(2)}-${randomDigits(8)}-${randomDigits(4)}`
}

function genDocument(num_sect = randInt(2, 20), num_paras = randInt(5, 25), min_words = randInt(7, 20), max_words = min_words + randInt(1, 10)) {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  })
  const roles = ['Respondent', 'Applicant', 'Third-Party'] as const
  const titles = [
    'Motion to Dismiss',
    'Declaration Under Penalty of Perjury',
    'Request for Continuance',
    'Affidavit of Service',
    'Notice of Hearing',
    'Petition for Relief',
    'Statement of Facts',
    'Memorandum of Points and Authorities',
    'Order to Show Cause',
    'Notice of Motion',
  ]

  const content: (string | { type: 'heading'; text: string } | { type: 'paragraph'; text: string; content?: { text: string }[] })[] = []

  for (let s = 0; s < num_sect; s++) {
    content.push({
      type: 'heading',
      text: titleCase(lorem.generateWords(randInt(2, 5))),
    })

    const sectionParas = randInt(Math.ceil(num_paras / num_sect) - 2, Math.ceil(num_paras / num_sect) + 2)
    for (let p = 0; p < Math.max(1, sectionParas); p++) {
      const paraText = lorem.generateSentences(randInt(min_words, max_words))

      // 35% chance to add subparagraphs
      if (Math.random() < 0.35) {
        const numSubparagraphs = randInt(2, 4)
        const subparagraphs = Array.from({ length: numSubparagraphs }, () => ({
          text: lorem.generateSentences(randInt(2, 4)),
        }))

        content.push({
          type: 'paragraph',
          text: paraText,
          content: subparagraphs,
        })
      } else {
        content.push(paraText)
      }
    }
  }

  const getRandomRole = () => roles[randInt(0, roles.length - 1)]!
  const getRandomTitle = () => titles[randInt(0, titles.length - 1)]!

  const author = {
    name: titleCase(lorem.generateWords(2).replace(/\s+/g, ' ')),
    role: getRandomRole(),
  }

  const submitter = {
    name: titleCase(lorem.generateWords(2).replace(/\s+/g, ' ')),
    role: getRandomRole(),
  }

  const doc: Document = {
    version: '0.0.0',
    type: 'document',
    id: crypto.randomUUID(),
    title: getRandomTitle(),
    properties: {
      author,
      submitted_by: submitter,
      case_number: randomCaseNumber(),
      date: randomDate(new Date('2020-01-01'), new Date()),
    },
    features: {
      pageNumbers: Math.random() > 0.3,
      docID: Math.random() > 0.2,
      initialsField: Math.random() > 0.3,
      signatoryPage: {
        applicant: Math.random() > 0.2,
        respondent: Math.random() > 0.2,
        includeCounsel: Math.random() > 0.4,
      },
    },
    content,
  }

  return doc
}


const keyPriorities = [
  'version',
  'type',
  'title',
  'id',
  'properties',
  'features',
  'text'
]
const keyPrioritiesMap = keyPriorities.reduce((obj: { [k: string]: number }, v, i) => {
  obj[v] = i
  return obj
}, {})

/**
 * Sorting function to prioritize generated yaml key ordering
 */
function sortKeys(a: string, b: string) {
  const aPriority = keyPrioritiesMap[a as keyof typeof keyPrioritiesMap] ?? keyPriorities.length
  const bPriority = keyPrioritiesMap[b as keyof typeof keyPrioritiesMap] ?? keyPriorities.length

  if (aPriority !== bPriority) return aPriority - bPriority
  if (aPriority < keyPriorities.length) return 0
  return a.localeCompare(b)
}

/**
 * Main entrypoint
 */
export default async function ({ params }: RouteContext) {
  const amount = (params.amount as number) || 1
  const outdir = (params.outdir as string) || 'out'

  const { mkdir } = await import('node:fs/promises')
  await mkdir(outdir, { recursive: true })

  const documentPaths: string[] = []

  for (let i = 0; i < amount; i++) {
    const doc = genDocument()
    const yaml = dump(doc, {
      sortKeys: sortKeys,
      lineWidth: 120,
    })

    const filename = `document_${i + 1}.yaml`
    const filepath = pathjoin(outdir, filename)

    await Bun.write(filepath, yaml)
    documentPaths.push(filename)
    console.log(`Generated: ${filepath}`)
  }

  // Create a globals file that references all generated documents
  const globalsFile = {
    version: '0.0.0',
    type: 'globals',
    documents: documentPaths,
  }

  const globalsYaml = dump(globalsFile, {
    sortKeys: sortKeys,
    lineWidth: 120,
  })

  const globalsPath = pathjoin(outdir, 'main.yaml')
  await Bun.write(globalsPath, globalsYaml)
  console.log(`Generated: ${globalsPath}`)
}
