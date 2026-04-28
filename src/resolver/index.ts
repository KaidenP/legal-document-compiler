import type { ParsedDocument, DocumentAST, ASTNode, HeadingNode, SubheadingNode, ParagraphNode, ResolvedInline } from '../types/ast.ts';
import type { YamlDefaults } from '../types/input.ts';
import type { ResolvedFormatRule } from '../types/format.ts';
import { toRoman } from './numbering.ts';
import { buildRefIndex, resolveRef } from './references.ts';

const PLACEHOLDER_FORMAT: ResolvedFormatRule = {
  pt: 12,
  bold: false,
  italic: false,
  spacing: { between: 12, after: 12, collapseWithPrevious: false },
};

export function resolve(documents: ParsedDocument[], defaults: YamlDefaults): DocumentAST[] {
  const refIndex = buildRefIndex(documents);

  return documents.map(doc => {
    let paraCount = 0;
    let sectionCount = 0;

    const nodes: ASTNode[] = doc.nodes.map(node => {
      if (node.type === 'heading') {
        sectionCount++;
        const heading: HeadingNode = {
          type: 'heading',
          sectionNumber: sectionCount,
          romanNumeral: toRoman(sectionCount),
          content: node.content,
          format: PLACEHOLDER_FORMAT,
        };
        if (node.id !== undefined) heading.id = node.id;
        return heading;
      }

      if (node.type === 'subheading') {
        const sub: SubheadingNode = {
          type: 'subheading',
          content: node.content,
          format: PLACEHOLDER_FORMAT,
        };
        if (node.id !== undefined) sub.id = node.id;
        return sub;
      }

      // paragraph
      paraCount++;
      const resolvedContent: ResolvedInline[] = node.content.map(inline => {
        if (inline.type === 'text') return inline;
        const rendered = resolveRef(inline.ref, inline.template, doc.id, refIndex, documents, defaults);
        return { type: 'reference', renderedText: rendered };
      });

      const para: ParagraphNode = {
        type: 'paragraph',
        paragraphNumber: paraCount,
        content: resolvedContent,
        format: PLACEHOLDER_FORMAT,
      };
      if (node.id !== undefined) para.id = node.id;
      return para;
    });

    return {
      id: doc.id,
      title: doc.title,
      outputFile: doc.outputFile,
      features: doc.features,
      margins: doc.margins,
      nodes,
    };
  });
}
