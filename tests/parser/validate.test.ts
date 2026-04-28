import { describe, it, expect } from 'bun:test';
import { validateInput } from '../../src/parser/validate.ts';

describe('validateInput', () => {
  const minimalValid = {
    defaults: {
      case_number: 'FC-01',
      date: '01JAN26',
      author: { role: 'Respondent', name: 'Jane Doe' },
    },
    documents: [
      { id: 'doc1', title: 'Doc 1', content: [] },
    ],
  };

  it('accepts valid input', () => {
    const result = validateInput(minimalValid);
    expect(result.defaults.case_number).toBe('FC-01');
    expect(result.documents).toHaveLength(1);
  });

  it('throws on missing defaults', () => {
    expect(() => validateInput({ documents: [] })).toThrow('Error at root');
  });

  it('throws on missing documents', () => {
    expect(() => validateInput({ defaults: minimalValid.defaults })).toThrow('Error at root');
  });

  it('throws on unknown content type', () => {
    const input = {
      ...minimalValid,
      documents: [{ id: 'd', title: 'T', content: [{ type: 'unknown' }] }],
    };
    expect(() => validateInput(input)).toThrow('Error at documents[0].content[0].type');
  });

  it('throws on heading with non-string content', () => {
    const input = {
      ...minimalValid,
      documents: [{ id: 'd', title: 'T', content: [{ type: 'heading', content: ['array'] }] }],
    };
    expect(() => validateInput(input)).toThrow('Error at documents[0].content[0]');
  });

  it('throws on unknown feature', () => {
    const input = {
      ...minimalValid,
      defaults: { ...minimalValid.defaults, features: ['bad_feature'] },
    };
    expect(() => validateInput(input)).toThrow('Error at defaults.features[0]');
  });

  it('throws on unknown format override type', () => {
    const input = {
      ...minimalValid,
      defaults: {
        ...minimalValid.defaults,
        format: { overrides: { subtitle: { pt: 12 } } },
      },
    };
    expect(() => validateInput(input)).toThrow('Error at defaults.format.overrides.subtitle');
  });
});
