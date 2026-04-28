const ROMAN_VALS: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

/**
 * Converts a positive integer to its Roman numeral representation.
 *
 * @param n - A positive integer to convert to Roman numerals (must be greater than 0)
 * @returns The Roman numeral string representation of the input number
 * @throws {Error} If the input number is less than or equal to 0
 *
 * @example
 * ```ts
 * toRoman(1) // "I"
 * toRoman(4) // "IV"
 * toRoman(9) // "IX"
 * toRoman(1994) // "MCMXCIV"
 * ```
 */
export function toRoman(n: number): string {
  if (n <= 0) throw new Error(`Roman numeral must be positive, got ${n}`);
  let result = '';
  let remaining = n;
  for (const [val, sym] of ROMAN_VALS) {
    while (remaining >= val) {
      result += sym;
      remaining -= val;
    }
  }
  return result;
}

export interface NumberingResult {
  paragraphNumber: number;
  sectionNumber: number;
  romanNumeral: string;
}

export function assignNumberings(nodes: import('../types/ast.ts').ParsedNode[]): Map<number, NumberingResult> {
  const map = new Map<number, NumberingResult>();
  let paraCount = 0;
  let sectionCount = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    if (node.type === 'heading') {
      sectionCount++;
      map.set(i, { paragraphNumber: 0, sectionNumber: sectionCount, romanNumeral: toRoman(sectionCount) });
    } else if (node.type === 'paragraph') {
      paraCount++;
      map.set(i, { paragraphNumber: paraCount, sectionNumber: 0, romanNumeral: '' });
    }
  }
  return map;
}
