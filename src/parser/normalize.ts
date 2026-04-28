import type {
  YamlInput, YamlDocument, YamlContentItem, YamlContentObject,
  YamlDefaults, Feature
} from '../types/input.ts';
import type { ParsedDocument, ParsedNode, ParsedParagraph, ParsedInline, ParsedHeading, ParsedSubheading } from '../types/ast.ts';
import type { ResolvedMargins } from '../types/format.ts';

const DEFAULT_FEATURES: Feature[] = ['page_number', 'case_number', 'date', 'title', 'author'];
const DEFAULT_MARGINS: ResolvedMargins = { top: 72, bottom: 72, left: 72, right: 72 };

function resolveMargins(base: ResolvedMargins, override?: YamlDefaults['margins']): ResolvedMargins {
  if (!override) return base;
  return {
    top: override.top ?? base.top,
    bottom: override.bottom ?? base.bottom,
    left: override.left ?? base.left,
    right: override.right ?? base.right,
  };
}

function normalizeInlineItem(item: YamlContentItem): ParsedInline {
  if (typeof item === 'string') {
    return { type: 'text', value: item };
  }
  const obj = item as YamlContentObject;
  if (obj.type === 'reference') {
    if (!obj.ref) throw new Error('reference missing ref field');
    const ref: import('../types/ast.ts').ParsedReference = { type: 'reference', ref: obj.ref };
    if (obj.template !== undefined) ref.template = obj.template;
    return ref;
  }
  // plain string content object inside array
  if (typeof obj.content === 'string') {
    return { type: 'text', value: obj.content };
  }
  throw new Error(`unexpected inline item`);
}

function normalizeContentItem(item: YamlContentItem, docId: string): ParsedNode {
  // plain string → paragraph
  if (typeof item === 'string') {
    return {
      type: 'paragraph',
      content: [{ type: 'text', value: item }],
    } satisfies ParsedParagraph;
  }

  const obj = item as YamlContentObject;

  // heading
  if (obj.type === 'heading') {
    const node: ParsedHeading = { type: 'heading', content: obj.content as string };
    if (obj.id !== undefined) node.id = obj.id;
    if (obj.format !== undefined) node.formatOverride = obj.format;
    return node;
  }

  // subheading
  if (obj.type === 'subheading') {
    const node: ParsedSubheading = { type: 'subheading', content: obj.content as string };
    if (obj.id !== undefined) node.id = obj.id;
    if (obj.format !== undefined) node.formatOverride = obj.format;
    return node;
  }

  // reference at top level is an error in isolation; treat as paragraph with one reference
  if (obj.type === 'reference') {
    if (!obj.ref) throw new Error(`reference missing ref in document "${docId}"`);
    const para: ParsedParagraph = {
      type: 'paragraph',
      content: [{ type: 'reference', ref: obj.ref, ...(obj.template !== undefined ? { template: obj.template } : {}) }],
    };
    if (obj.id !== undefined) para.id = obj.id;
    return para;
  }

  // paragraph (explicit or implicit)
  const para: ParsedParagraph = { type: 'paragraph', content: [] };
  if (obj.id !== undefined) para.id = obj.id;
  if (obj.format !== undefined) para.formatOverride = obj.format;

  if (typeof obj.content === 'string') {
    para.content = [{ type: 'text', value: obj.content }];
  } else if (Array.isArray(obj.content)) {
    para.content = obj.content.map(normalizeInlineItem);
  } else if (obj.content === undefined) {
    para.content = [];
  }

  return para;
}

function normalizeDocument(doc: YamlDocument, defaults: YamlDefaults): ParsedDocument {
  const features = doc.features ?? defaults.features ?? DEFAULT_FEATURES;
  const margins = resolveMargins(
    resolveMargins(DEFAULT_MARGINS, defaults.margins),
    doc.margins
  );
  const outputFile = doc.output_file ?? `${doc.id}.pdf`;

  const nodes = doc.content.map(item => normalizeContentItem(item, doc.id));

  return {
    id: doc.id,
    title: doc.title,
    outputFile,
    features,
    margins,
    nodes,
  };
}

export function normalizeInput(input: YamlInput): ParsedDocument[] {
  return input.documents.map(doc => normalizeDocument(doc, input.defaults));
}
