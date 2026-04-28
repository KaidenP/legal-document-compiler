import type { Feature } from './input.ts';
import type { ResolvedFormatRule, ResolvedMargins } from './format.ts';

/**
 * Represents a parsed document with all structural and formatting information.
 *
 * This is an intermediate representation that contains the raw parsed structure
 * of a legal document, including headings, subheadings, and paragraphs before
 * format resolution and final AST compilation.
 *
 * @interface ParsedDocument
 * @property {string} id - Unique identifier for the document
 * @property {string} title - The title of the document
 * @property {string} outputFile - Path where the compiled document will be written
 * @property {Feature[]} features - List of enabled features for this document
 * @property {ResolvedMargins} margins - Resolved margin configuration for the document
 * @property {ParsedNode[]} nodes - Array of parsed content nodes (headings, subheadings, paragraphs)
 *
 * @example
 * const doc: ParsedDocument = {
 *   id: "doc-001",
 *   title: "Legal Agreement",
 *   outputFile: "output.html",
 *   features: ["numbering", "formatting"],
 *   margins: { top: 1, bottom: 1, left: 1, right: 1 },
 *   nodes: [...]
 * };
 */
export interface ParsedDocument {
  id: string;
  title: string;
  outputFile: string;
  features: Feature[];
  margins: ResolvedMargins;
  nodes: ParsedNode[];
}

export type ParsedNode =
  | ParsedHeading
  | ParsedSubheading
  | ParsedParagraph;

interface ParsedBase {
  id?: string;
  formatOverride?: import('./input.ts').YamlFormatRule;
}

export interface ParsedHeading extends ParsedBase {
  type: 'heading';
  content: string;
}

export interface ParsedSubheading extends ParsedBase {
  type: 'subheading';
  content: string;
}

export interface ParsedParagraph extends ParsedBase {
  type: 'paragraph';
  content: ParsedInline[];
}

export type ParsedInline = ParsedText | ParsedReference;

export interface ParsedText {
  type: 'text';
  value: string;
}

export interface ParsedReference {
  type: 'reference';
  ref: string;
  template?: string;
}

export interface DocumentAST {
  id: string;
  title: string;
  outputFile: string;
  features: Feature[];
  margins: ResolvedMargins;
  nodes: ASTNode[];
}

export type ASTNode = HeadingNode | SubheadingNode | ParagraphNode;

interface ASTBase {
  id?: string;
  format: ResolvedFormatRule;
}

export interface HeadingNode extends ASTBase {
  type: 'heading';
  sectionNumber: number;
  romanNumeral: string;
  content: string;
}

export interface SubheadingNode extends ASTBase {
  type: 'subheading';
  content: string;
}

export interface ParagraphNode extends ASTBase {
  type: 'paragraph';
  paragraphNumber: number;
  content: ResolvedInline[];
}

export type ResolvedInline = ResolvedText | ResolvedRef;

export interface ResolvedText {
  type: 'text';
  value: string;
}

export interface ResolvedRef {
  type: 'reference';
  renderedText: string;
}
