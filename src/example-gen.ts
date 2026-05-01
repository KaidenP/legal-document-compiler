import { join as pathjoin } from 'node:path'
import { type RouteContext } from 'shell'
import { LoremIpsum } from 'lorem-ipsum'
import { dump } from 'js-yaml'

import { Document, Input } from './inputSchema'

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

function genDocument(num_sect = randInt(2, 10), num_paras = randInt(5, 20), min_words = randInt(7, 15), max_words = min_words + randInt(1, 5)) {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 5,
      min: 2,
    },
    wordsPerSentence: {
      max: max_words,
      min: min_words,
    },
  })



  let doc: Document = {
    version: '0.0.0',
    type: 'document',
    title: titleCase(lorem.generateWords(randInt(1, 4))),
    properties: Math.random() > 0.33 ? undefined : {
      case_number: Math.random() > 0.5 ? undefined : randomCaseNumber(),
      case_name: Math.random() > 0.5 ? undefined : `${titleCase((new LoremIpsum()).generateWords(1))} v. ${titleCase((new LoremIpsum()).generateWords(1))}`,
      author: Math.random() > 0.5 ? undefined : {
        name: titleCase(lorem.generateWords(2)),
        role: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'Applicant' : 'Respondent') : 'Third-Party',
      },
      submitted_by: Math.random() > 0.2 ? undefined : {
        name: titleCase(lorem.generateWords(2)),
        role: Math.random() > 0.5 ? 'Applicant' : 'Respondent',
      },
      date: Math.random() > 0.5 ? undefined : randomDate(),
    },
    content: [],
    features: {
      pageNumbers: Math.random() > 0.5
    }
  }

  for (let i = num_sect; i > 0; i--) {
    doc.content.push({
      type: 'heading',
      text: titleCase(lorem.generateWords(randInt(2, 5))),
      subTitle: Math.random() > 0.5 ? titleCase(lorem.generateWords(randInt(2, 4))) : undefined,
    })
    for (let j = num_paras; j > 0; j--) {
      doc.content.push(lorem.generateParagraphs(1))
    }
  }

  doc = Document.parse(doc)

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

export default async function ({ args, params }: RouteContext) {
  const docs: Input[] = [{
    version: '0.0.0',
    type: 'globals',
    properties: {
      case_number: randomCaseNumber(),
      case_name: `${titleCase((new LoremIpsum()).generateWords(1))} v. ${titleCase((new LoremIpsum()).generateWords(1))}`,
      author: {
        name: titleCase((new LoremIpsum()).generateWords(2)),
        role: Math.random() > 0.5 ? 'Applicant' : 'Respondent',
      },
      date: randomDate(),
    }
  }]

  for (let i = 0; i < params.amount; i++)
    docs.push(genDocument())

  let outputYaml = '%YAML 1.2'
  docs.forEach(doc => outputYaml += '\n---\n' + dump(doc, {
    replacer: (_k, v) => {
      if (v instanceof Date) {
        return v.toISOString().slice(0, 10)
      }

      return v
    },
    sortKeys: (a: string, b: string) => {
      const aPriority = keyPrioritiesMap[a as keyof typeof keyPrioritiesMap] ?? keyPriorities.length
      const bPriority = keyPrioritiesMap[b as keyof typeof keyPrioritiesMap] ?? keyPriorities.length

      if (aPriority !== bPriority) return aPriority - bPriority
      if (aPriority < keyPriorities.length) return 0
      return a.localeCompare(b)
    }
  }))

  // console.log(outputYaml)
  await Bun.write(params.file, outputYaml)
  console.log('YAML Generated!!!')
}
