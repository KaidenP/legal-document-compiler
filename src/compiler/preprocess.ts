import { Document, ContentHeading, ContentParagraph, Content, ContentSubParagraph } from '../schemas/document-schema'

function numberSubparagraphs(subparagraphs: ContentSubParagraph[]): Array<{ text: string; letter: string }> {
  return subparagraphs.map((sub, index) => {
    const text = typeof sub === 'string' ? sub : sub.text
    return {
      text,
      letter: String.fromCharCode(97 + index), // a, b, c, ...
    }
  })
}

export function numberParagraphs(doc: Document): Document {
  let paragraphCount = 0

  const numberedContent = doc.content.map((item) => {
    if (typeof item === 'string') {
      paragraphCount++
      return {
        type: 'paragraph' as const,
        text: item,
        number: paragraphCount,
      }
    }

    if (item.type === 'heading') {
      return item
    }

    if (item.type === 'paragraph') {
      paragraphCount++
      const numbered = {
        ...item,
        number: paragraphCount,
      }

      if (item.content && item.content.length > 0) {
        return {
          ...numbered,
          content: numberSubparagraphs(item.content),
        }
      }

      return numbered
    }

    return item
  })

  return {
    ...doc,
    content: numberedContent,
  }
}
