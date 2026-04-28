import { describe, it, expect } from 'bun:test';
import { toRoman, assignNumberings } from '../../src/resolver/numbering.ts';

describe('toRoman', () => {
  it('converts basic values', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(10)).toBe('X');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(50)).toBe('L');
    expect(toRoman(90)).toBe('XC');
    expect(toRoman(100)).toBe('C');
  });

  it('converts compound values', () => {
    expect(toRoman(3)).toBe('III');
    expect(toRoman(8)).toBe('VIII');
    expect(toRoman(14)).toBe('XIV');
    expect(toRoman(2024)).toBe('MMXXIV');
  });

  it('throws on zero or negative', () => {
    expect(() => toRoman(0)).toThrow();
    expect(() => toRoman(-1)).toThrow();
  });
});

describe('assignNumberings', () => {
  it('counts paragraphs per document', () => {
    const nodes: import('../../src/types/ast.ts').ParsedNode[] = [
      { type: 'paragraph', content: [{ type: 'text', value: 'a' }] },
      { type: 'heading', content: 'H' },
      { type: 'paragraph', content: [{ type: 'text', value: 'b' }] },
    ];
    const map = assignNumberings(nodes);
    expect(map.get(0)?.paragraphNumber).toBe(1);
    expect(map.get(1)?.sectionNumber).toBe(1);
    expect(map.get(2)?.paragraphNumber).toBe(2);
  });
});
