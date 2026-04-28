import type { YamlFormatRule, YamlFormatConfig, ContentType } from '../types/input.ts';
import type { ResolvedFormatRule, ResolvedSpacing } from '../types/format.ts';

const BASE_FORMAT: ResolvedFormatRule = {
  pt: 12,
  bold: false,
  italic: false,
  spacing: { between: 12, after: 12, collapseWithPrevious: false },
};

function mergeSpacing(base: ResolvedSpacing, override: import('../types/input.ts').YamlSpacing): ResolvedSpacing {
  return {
    between: override.between ?? base.between,
    after: override.after ?? base.after,
    collapseWithPrevious: override.collapse_with_previous ?? base.collapseWithPrevious,
  };
}

function applyRule(base: ResolvedFormatRule, rule: YamlFormatRule): ResolvedFormatRule {
  return {
    pt: rule.pt ?? base.pt,
    bold: rule.bold ?? base.bold,
    italic: rule.italic ?? base.italic,
    spacing: rule.spacing ? mergeSpacing(base.spacing, rule.spacing) : base.spacing,
  };
}

export function resolveFormat(
  nodeType: ContentType,
  globalFormat: YamlFormatConfig | undefined,
  docFormat: YamlFormatConfig | undefined,
  nodeOverride: YamlFormatRule | undefined,
): ResolvedFormatRule {
  let result = BASE_FORMAT;

  if (globalFormat?.defaults) result = applyRule(result, globalFormat.defaults);
  if (globalFormat?.overrides?.[nodeType]) result = applyRule(result, globalFormat.overrides[nodeType]!);
  if (docFormat?.defaults) result = applyRule(result, docFormat.defaults);
  if (docFormat?.overrides?.[nodeType]) result = applyRule(result, docFormat.overrides[nodeType]!);
  if (nodeOverride) result = applyRule(result, nodeOverride);

  return result;
}
