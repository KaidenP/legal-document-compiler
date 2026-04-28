import { describe, it, expect } from 'bun:test';
import { resolveFormat } from '../../src/formatter/inherit.ts';

describe('resolveFormat', () => {
  it('returns base defaults when nothing overrides', () => {
    const result = resolveFormat('paragraph', undefined, undefined, undefined);
    expect(result).toEqual({
      pt: 12,
      bold: false,
      italic: false,
      spacing: { between: 12, after: 12, collapseWithPrevious: false },
    });
  });

  it('applies global defaults', () => {
    const result = resolveFormat('paragraph', { defaults: { pt: 11 } }, undefined, undefined);
    expect(result.pt).toBe(11);
  });

  it('applies global type override', () => {
    const result = resolveFormat('heading', {
      defaults: { pt: 11 },
      overrides: { heading: { pt: 14, bold: true } },
    }, undefined, undefined);
    expect(result.pt).toBe(14);
    expect(result.bold).toBe(true);
  });

  it('doc overrides beat global', () => {
    const result = resolveFormat('paragraph',
      { defaults: { pt: 11 } },
      { defaults: { pt: 13 } },
      undefined
    );
    expect(result.pt).toBe(13);
  });

  it('node override beats all', () => {
    const result = resolveFormat('paragraph',
      { defaults: { pt: 11 } },
      { defaults: { pt: 13 } },
      { pt: 16 }
    );
    expect(result.pt).toBe(16);
  });

  it('merges spacing independently', () => {
    const result = resolveFormat('paragraph',
      { defaults: { spacing: { between: 14 } } },
      { defaults: { spacing: { after: 20 } } },
      undefined
    );
    expect(result.spacing.between).toBe(14);
    expect(result.spacing.after).toBe(20);
    expect(result.spacing.collapseWithPrevious).toBe(false);
  });

  it('global type override does not affect other types', () => {
    const result = resolveFormat('paragraph', {
      overrides: { heading: { bold: true } },
    }, undefined, undefined);
    expect(result.bold).toBe(false);
  });
});
