import type { DocumentAST, ASTNode } from '../types/ast.ts';
import type { YamlDefaults, YamlFormatConfig, YamlDocument, ContentType } from '../types/input.ts';
import { resolveFormat } from './inherit.ts';

function resolveDocFormat(doc: DocumentAST, globalFormat: YamlFormatConfig | undefined, docFormatConfig: YamlFormatConfig | undefined): DocumentAST {
  const nodes: ASTNode[] = doc.nodes.map(node => {
    const nodeType: ContentType = node.type;
    const formatOverride = 'formatOverride' in node ? (node as { formatOverride?: import('../types/input.ts').YamlFormatRule }).formatOverride : undefined;
    const format = resolveFormat(nodeType, globalFormat, docFormatConfig, formatOverride);
    return { ...node, format };
  });
  return { ...doc, nodes };
}

export function applyFormatting(
  documents: DocumentAST[],
  defaults: YamlDefaults,
  rawDocuments: YamlDocument[],
): DocumentAST[] {
  return documents.map((doc, i) => {
    const rawDoc = rawDocuments[i];
    return resolveDocFormat(doc, defaults.format, rawDoc?.format);
  });
}
