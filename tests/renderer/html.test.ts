import { describe, it, expect } from 'bun:test';
import { renderHtml } from '../../src/renderer/html.ts';
import type { DocumentAST } from '../../src/types/ast.ts';

const baseFormat = {
  pt: 12,
  bold: false,
  italic: false,
  spacing: { between: 12, after: 12, collapseWithPrevious: false },
};

const meta = {
  case_number: 'FC-01',
  date: '01JAN26',
  author: { role: 'Respondent', name: 'Jane Doe' },
};

function makeDoc(overrides: Partial<DocumentAST> = {}): DocumentAST {
  return {
    id: 'test_doc',
    title: 'Test Document',
    outputFile: 'test_doc.pdf',
    features: ['page_number', 'case_number', 'date', 'title', 'author'],
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    nodes: [],
    ...overrides,
  };
}

describe('renderHtml', () => {
  it('produces valid HTML with doctype', () => {
    const html = renderHtml(makeDoc(), meta);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html>');
    expect(html).toContain('</html>');
  });

  it('includes Times New Roman font', () => {
    const html = renderHtml(makeDoc(), meta);
    expect(html).toContain('Times New Roman');
  });

  it('renders heading with roman numeral', () => {
    const doc = makeDoc({
      nodes: [{
        type: 'heading',
        sectionNumber: 1,
        romanNumeral: 'I',
        content: 'My Section',
        format: baseFormat,
      }],
    });
    const html = renderHtml(doc, meta);
    expect(html).toContain('Section I');
    expect(html).toContain('My Section');
  });

  it('renders paragraph with number', () => {
    const doc = makeDoc({
      nodes: [{
        type: 'paragraph',
        paragraphNumber: 3,
        content: [{ type: 'text', value: 'Hello world' }],
        format: baseFormat,
      }],
    });
    const html = renderHtml(doc, meta);
    expect(html).toContain('3.');
    expect(html).toContain('Hello world');
  });

  it('renders subheading', () => {
    const doc = makeDoc({
      nodes: [{
        type: 'subheading',
        content: 'Sub Title',
        format: baseFormat,
      }],
    });
    const html = renderHtml(doc, meta);
    expect(html).toContain('Sub Title');
    expect(html).toContain('h3');
  });

  it('includes title and author when features enabled', () => {
    const html = renderHtml(makeDoc(), meta);
    expect(html).toContain('Test Document');
    expect(html).toContain('Respondent Jane Doe');
  });

  it('omits title when feature disabled', () => {
    const doc = makeDoc({ features: ['page_number'] });
    const html = renderHtml(doc, meta);
    expect(html).not.toContain('Test Document');
  });

  it('escapes HTML special characters', () => {
    const doc = makeDoc({
      nodes: [{
        type: 'paragraph',
        paragraphNumber: 1,
        content: [{ type: 'text', value: 'A & B <test>' }],
        format: baseFormat,
      }],
    });
    const html = renderHtml(doc, meta);
    expect(html).toContain('A &amp; B &lt;test&gt;');
  });

  it('uses correct margin in @page rule', () => {
    const doc = makeDoc({ margins: { top: 36, bottom: 36, left: 54, right: 54 } });
    const html = renderHtml(doc, meta);
    expect(html).toContain('36pt 54pt 36pt 54pt');
  });
});
