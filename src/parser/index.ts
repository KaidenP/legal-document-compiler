import * as yaml from 'js-yaml';
import { validateInput } from './validate.ts';
import { normalizeInput } from './normalize.ts';
import type { ParsedDocument } from '../types/ast.ts';
import type { YamlInput } from '../types/input.ts';

export interface ParserResult {
  documents: ParsedDocument[];
  defaults: YamlInput['defaults'];
}

export function parse(yamlString: string): ParserResult {
  const raw = yaml.load(yamlString);
  const input = validateInput(raw);
  const documents = normalizeInput(input);
  return { documents, defaults: input.defaults };
}
