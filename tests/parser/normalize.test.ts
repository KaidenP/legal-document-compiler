import { describe, it, expect } from 'bun:test';
import { normalizeInput } from '../../src/parser/normalize.ts';

const defaults = {
  case_number: 'FC-01',
  date: '01JAN26',
  author: { role: 'Respondent', name: 'Jane Doe' },
};

describe('normalizeInput', () => {
  it('converts plain string to paragraph', () => {
    const docs = normalizeInput({
      defaults,
      documents: [{ id: 'd1', title: 'T', content: ['hello world'] }],
    });
    const node = docs[0]?.nodes[0];
    expect(node?.type).toBe('paragraph');
    if (node?.type === 'paragraph') {
      expect(node.content[0]).toEqual({ type: 'text', value: 'hello world' });
    }
  });

  it('converts { content: string } to paragraph', () => {
    const docs = normalizeInput({
      defaults,
      documents: [{ id: 'd1', title: 'T', content: [{ content: 'plain' }] }],
    });
    const node = docs[0]?.nodes[0];
    expect(node?.type).toBe('paragraph');
  });

  it('normalizes inline array with reference', () => {
    const docs = normalizeInput({
      defaults,
      documents: [{
        id: 'd1',
        title: 'T',
        content: [{
          content: [
            'text part',
            { type: 'reference', ref: '@some_id' },
          ],
        }],
      }],
    });
    const node = docs[0]?.nodes[0];
    expect(node?.type).toBe('paragraph');
    if (node?.type === 'paragraph') {
      expect(node.content[0]).toEqual({ type: 'text', value: 'text part' });
      expect(node.content[1]).toEqual({ type: 'reference', ref: '@some_id' });
    }
  });

  it('applies default margins when none specified', () => {
    const docs = normalizeInput({
      defaults,
      documents: [{ id: 'd1', title: 'T', content: [] }],
    });
    expect(docs[0]?.margins).toEqual({ top: 72, bottom: 72, left: 72, right: 72 });
  });

  it('applies default output file name', () => {
    const docs = normalizeInput({
      defaults,
      documents: [{ id: 'my_doc', title: 'T', content: [] }],
    });
    expect(docs[0]?.outputFile).toBe('my_doc.pdf');
  });

  it('uses output_file when specified', () => {
    const docs = normalizeInput({
      defaults,
      documents: [{ id: 'my_doc', title: 'T', content: [], output_file: 'output/custom.pdf' }],
    });
    expect(docs[0]?.outputFile).toBe('output/custom.pdf');
  });

  it('preserves heading node', () => {
    const docs = normalizeInput({
      defaults,
      documents: [{ id: 'd1', title: 'T', content: [{ type: 'heading', content: 'Section Title' }] }],
    });
    const node = docs[0]?.nodes[0];
    expect(node?.type).toBe('heading');
    if (node?.type === 'heading') {
      expect(node.content).toBe('Section Title');
    }
  });
});
