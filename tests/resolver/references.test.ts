import { describe, it, expect } from 'bun:test';
import { buildRefIndex, resolveRef } from '../../src/resolver/references.ts';
import type { ParsedDocument } from '../../src/types/ast.ts';

const defaults = {
  case_number: 'FC-01',
  date: '01JAN26',
  author: { role: 'Respondent', name: 'Jane Doe' },
};

const docA: ParsedDocument = {
  id: 'docA',
  title: 'Doc A',
  outputFile: 'docA.pdf',
  features: [],
  margins: { top: 72, bottom: 72, left: 72, right: 72 },
  nodes: [
    { type: 'paragraph', id: 'para1', content: [{ type: 'text', value: 'hello' }] },
    { type: 'paragraph', content: [{ type: 'text', value: 'world' }] },
  ],
};

describe('buildRefIndex', () => {
  it('indexes named paragraphs', () => {
    const index = buildRefIndex([docA]);
    expect(index.has('docA/para1')).toBe(true);
    expect(index.get('docA/para1')?.paragraphNumber).toBe(1);
  });

  it('does not index unnamed paragraphs', () => {
    const index = buildRefIndex([docA]);
    expect(index.size).toBe(1);
  });
});

describe('resolveRef', () => {
  it('resolves bare ref to paragraph number', () => {
    const index = buildRefIndex([docA]);
    const result = resolveRef('@para1', undefined, 'docA', index, [docA], defaults);
    expect(result).toBe('1');
  });

  it('resolves cross-doc ref', () => {
    const docB: ParsedDocument = {
      id: 'docB', title: 'Doc B', outputFile: 'docB.pdf',
      features: [], margins: { top: 72, bottom: 72, left: 72, right: 72 }, nodes: [],
    };
    const index = buildRefIndex([docA, docB]);
    const result = resolveRef('@docA/para1', undefined, 'docB', index, [docA, docB], defaults);
    expect(result).toBe('1');
  });

  it('applies template substitution', () => {
    const index = buildRefIndex([docA]);
    const result = resolveRef(
      '@para1',
      '{{author}} {{title}} {{date}} #{{paragraph}}',
      'docA', index, [docA], defaults
    );
    expect(result).toBe('Respondent Jane Doe Doc A 01JAN26 #1');
  });

  it('throws on unknown ref', () => {
    const index = buildRefIndex([docA]);
    expect(() => resolveRef('@missing', undefined, 'docA', index, [docA], defaults)).toThrow();
  });
});
