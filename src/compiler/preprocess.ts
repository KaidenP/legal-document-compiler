import { Document, ContentHeading, ContentParagraph, Content } from '../schemas/document-schema'

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
      return {
        ...item,
        number: paragraphCount,
      }
    }

    return item
  })

  return {
    ...doc,
    content: numberedContent,
  }
}
