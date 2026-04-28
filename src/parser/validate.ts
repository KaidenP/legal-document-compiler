import type { YamlInput, YamlDefaults, YamlDocument, YamlContentItem, YamlContentObject, YamlFormatConfig, YamlFormatRule, ContentType } from '../types/input.ts';

const VALID_CONTENT_TYPES = new Set<ContentType>(['heading', 'subheading', 'paragraph', 'reference']);
const VALID_FEATURES = new Set(['page_number', 'case_number', 'date', 'title', 'author']);

function fail(path: string, message: string): never {
  throw new Error(`Error at ${path}: ${message}`);
}

function assertString(value: unknown, path: string): string {
  if (typeof value !== 'string') fail(path, `expected string, got ${typeof value}`);
  return value;
}

function assertObject(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    fail(path, `expected object`);
  return value as Record<string, unknown>;
}

function validateFormatRule(value: unknown, path: string): YamlFormatRule {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    fail(path, 'expected object');
  const obj = value as Record<string, unknown>;
  const rule: YamlFormatRule = {};
  if ('pt' in obj) {
    if (typeof obj['pt'] !== 'number') fail(`${path}.pt`, 'expected number');
    rule.pt = obj['pt'] as number;
  }
  if ('bold' in obj) {
    if (typeof obj['bold'] !== 'boolean') fail(`${path}.bold`, 'expected boolean');
    rule.bold = obj['bold'] as boolean;
  }
  if ('italic' in obj) {
    if (typeof obj['italic'] !== 'boolean') fail(`${path}.italic`, 'expected boolean');
    rule.italic = obj['italic'] as boolean;
  }
  if ('spacing' in obj) {
    const sp = assertObject(obj['spacing'], `${path}.spacing`);
    rule.spacing = {};
    if ('between' in sp) {
      if (typeof sp['between'] !== 'number') fail(`${path}.spacing.between`, 'expected number');
      rule.spacing.between = sp['between'] as number;
    }
    if ('after' in sp) {
      if (typeof sp['after'] !== 'number') fail(`${path}.spacing.after`, 'expected number');
      rule.spacing.after = sp['after'] as number;
    }
    if ('collapse_with_previous' in sp) {
      if (typeof sp['collapse_with_previous'] !== 'boolean')
        fail(`${path}.spacing.collapse_with_previous`, 'expected boolean');
      rule.spacing.collapse_with_previous = sp['collapse_with_previous'] as boolean;
    }
  }
  return rule;
}

function validateFormatConfig(value: unknown, path: string): YamlFormatConfig {
  const obj = assertObject(value, path);
  const config: YamlFormatConfig = {};
  if ('defaults' in obj) {
    config.defaults = validateFormatRule(obj['defaults'], `${path}.defaults`);
  }
  if ('overrides' in obj) {
    const ov = assertObject(obj['overrides'], `${path}.overrides`);
    config.overrides = {};
    for (const key of Object.keys(ov)) {
      if (!VALID_CONTENT_TYPES.has(key as ContentType))
        fail(`${path}.overrides.${key}`, `unknown content type "${key}"`);
      config.overrides[key as ContentType] = validateFormatRule(ov[key], `${path}.overrides.${key}`);
    }
  }
  return config;
}

function validateContentItem(value: unknown, path: string): YamlContentItem {
  if (typeof value === 'string') return value;
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    fail(path, 'expected string or object');
  const obj = value as Record<string, unknown>;

  if ('type' in obj) {
    const t = obj['type'];
    if (!VALID_CONTENT_TYPES.has(t as ContentType))
      fail(`${path}.type`, `unknown type "${String(t)}"`);
  }

  const result: YamlContentObject = {};
  if ('type' in obj) result.type = obj['type'] as ContentType;
  if ('id' in obj) result.id = assertString(obj['id'], `${path}.id`);
  if ('ref' in obj) result.ref = assertString(obj['ref'], `${path}.ref`);
  if ('template' in obj) result.template = assertString(obj['template'], `${path}.template`);
  if ('format' in obj) result.format = validateFormatRule(obj['format'], `${path}.format`);

  if ('content' in obj) {
    const c = obj['content'];
    if (typeof c === 'string') {
      result.content = c;
    } else if (Array.isArray(c)) {
      result.content = c.map((item, i) => validateContentItem(item, `${path}.content[${i}]`));
    } else if (c !== undefined) {
      fail(`${path}.content`, 'expected string or array');
    }
  }

  // type=heading/subheading must have string content
  if (result.type === 'heading' || result.type === 'subheading') {
    if (typeof result.content !== 'string')
      fail(path, `type "${result.type}" requires a string content value`);
  }

  return result;
}

function validateDefaults(value: unknown): YamlDefaults {
  const obj = assertObject(value, 'defaults');
  const case_number = assertString(obj['case_number'], 'defaults.case_number');
  const date = assertString(obj['date'], 'defaults.date');

  const authorObj = assertObject(obj['author'], 'defaults.author');
  const author = {
    role: assertString(authorObj['role'], 'defaults.author.role'),
    name: assertString(authorObj['name'], 'defaults.author.name'),
  };

  const defaults: YamlDefaults = { case_number, date, author };

  if ('features' in obj) {
    if (!Array.isArray(obj['features'])) fail('defaults.features', 'expected array');
    defaults.features = (obj['features'] as unknown[]).map((f, i) => {
      if (typeof f !== 'string' || !VALID_FEATURES.has(f))
        fail(`defaults.features[${i}]`, `unknown feature "${String(f)}"`);
      return f as import('../types/input.ts').Feature;
    });
  }

  if ('margins' in obj) {
    const m = assertObject(obj['margins'], 'defaults.margins');
    defaults.margins = {};
    for (const side of ['top', 'bottom', 'left', 'right'] as const) {
      if (side in m) {
        if (typeof m[side] !== 'number') fail(`defaults.margins.${side}`, 'expected number');
        defaults.margins[side] = m[side] as number;
      }
    }
  }

  if ('format' in obj) {
    defaults.format = validateFormatConfig(obj['format'], 'defaults.format');
  }

  return defaults;
}

function validateDocument(value: unknown, index: number): YamlDocument {
  const path = `documents[${index}]`;
  const obj = assertObject(value, path);

  const id = assertString(obj['id'], `${path}.id`);
  const title = assertString(obj['title'], `${path}.title`);

  if (!Array.isArray(obj['content']))
    fail(`${path}.content`, 'expected array');

  const content = (obj['content'] as unknown[]).map((item, i) =>
    validateContentItem(item, `${path}.content[${i}]`)
  );

  const doc: YamlDocument = { id, title, content };

  if ('output_file' in obj) doc.output_file = assertString(obj['output_file'], `${path}.output_file`);

  if ('features' in obj) {
    if (!Array.isArray(obj['features'])) fail(`${path}.features`, 'expected array');
    doc.features = (obj['features'] as unknown[]).map((f, i) => {
      if (typeof f !== 'string' || !VALID_FEATURES.has(f))
        fail(`${path}.features[${i}]`, `unknown feature "${String(f)}"`);
      return f as import('../types/input.ts').Feature;
    });
  }

  if ('margins' in obj) {
    const m = assertObject(obj['margins'], `${path}.margins`);
    doc.margins = {};
    for (const side of ['top', 'bottom', 'left', 'right'] as const) {
      if (side in m) {
        if (typeof m[side] !== 'number') fail(`${path}.margins.${side}`, 'expected number');
        if (doc.margins) doc.margins[side] = m[side] as number;
      }
    }
  }

  if ('format' in obj) {
    doc.format = validateFormatConfig(obj['format'], `${path}.format`);
  }

  return doc;
}

export function validateInput(raw: unknown): YamlInput {
  const obj = assertObject(raw, 'root');
  if (!('defaults' in obj)) fail('root', 'missing "defaults" field');
  if (!('documents' in obj)) fail('root', 'missing "documents" field');
  if (!Array.isArray(obj['documents'])) fail('documents', 'expected array');

  const defaults = validateDefaults(obj['defaults']);
  const documents = (obj['documents'] as unknown[]).map((doc, i) => validateDocument(doc, i));

  return { defaults, documents };
}
