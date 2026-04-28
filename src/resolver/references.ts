import type { ParsedDocument, ParsedParagraph } from '../types/ast.ts';
import type { YamlDefaults } from '../types/input.ts';
import { substituteTemplate } from './variables.ts';

/**
 * Represents a resolved reference entry containing document and paragraph information.
 * @internal
 */
interface RefEntry {
  /** The unique identifier of the document containing the referenced paragraph. */
  docId: string;
  /** The sequential paragraph number within the document. */
  paragraphNumber: number;
}

/**
 * Builds an index of all resolvable references across parsed documents.
 *
 * Scans through all documents and creates a map of reference keys to their corresponding
 * paragraph entries. Reference keys are in the format "docId/nodeId". Only paragraphs with
 * explicit IDs are indexed.
 *
 * @param documents - Array of parsed documents to index.
 * @returns A map where keys are reference identifiers (docId/nodeId) and values are RefEntry objects
 *          containing the document ID and paragraph number.
 *
 * @example
 * const index = buildRefIndex(documents);
 * const entry = index.get('doc1/section-1');
 * console.log(entry.paragraphNumber); // 5
 */
export function buildRefIndex(documents: ParsedDocument[]): Map<string, RefEntry> {
  const index = new Map<string, RefEntry>();
  for (const doc of documents) {
    let paraCount = 0;
    for (const node of doc.nodes) {
      if (node.type === 'paragraph') {
        paraCount++;
        if (node.id !== undefined) {
          index.set(`${doc.id}/${node.id}`, { docId: doc.id, paragraphNumber: paraCount });
        }
      }
    }
  }
  return index;
}

function parseRef(ref: string, currentDocId: string): { docId: string; nodeId: string } {
  const inner = ref.startsWith('@') ? ref.slice(1) : ref;
  const slashIdx = inner.indexOf('/');
  if (slashIdx === -1) {
    return { docId: currentDocId, nodeId: inner };
  }
  return { docId: inner.slice(0, slashIdx), nodeId: inner.slice(slashIdx + 1) };
}

export function resolveRef(
  ref: string,
  template: string | undefined,
  currentDocId: string,
  index: Map<string, RefEntry>,
  documents: ParsedDocument[],
  defaults: YamlDefaults,
): string {
  const { docId, nodeId } = parseRef(ref, currentDocId);
  const key = `${docId}/${nodeId}`;
  const entry = index.get(key);
  if (!entry) {
    throw new Error(`Error at documents[?].content[?].ref: reference "${ref}" not found in document "${docId}"`);
  }

  if (template === undefined) {
    return String(entry.paragraphNumber);
  }

  const targetDoc = documents.find(d => d.id === entry.docId);
  return substituteTemplate(template, {
    author: `${defaults.author.role} ${defaults.author.name}`,
    title: targetDoc?.title ?? docId,
    date: defaults.date,
    paragraph: String(entry.paragraphNumber),
  });
}
