import type { DocumentAST, ASTNode, ResolvedInline } from '../types/ast.ts';
import type { ResolvedFormatRule } from '../types/format.ts';
import type { Feature } from '../types/input.ts';
import { readFileSync } from 'node:fs';

const template = readFileSync(import.meta.dir + '/template.html', 'utf-8');

function formatStyle(fmt: ResolvedFormatRule): string {
  return [
    `font-size: ${fmt.pt}pt`,
    `font-weight: ${fmt.bold ? 'bold' : 'normal'}`,
    `font-style: ${fmt.italic ? 'italic' : 'normal'}`,
    `line-height: ${fmt.spacing.between}pt`,
    `margin-bottom: ${fmt.spacing.after}pt`,
  ].join('; ');
}

function renderInline(inlines: ResolvedInline[]): string {
  return inlines.map(inline => {
    if (inline.type === 'text') return escapeHtml(inline.value);
    return escapeHtml(inline.renderedText);
  }).join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderNode(node: ASTNode): string {
  if (node.type === 'heading') {
    return `<h2 style="${formatStyle(node.format)}">Section ${node.romanNumeral} — ${escapeHtml(node.content)}</h2>`;
  }
  if (node.type === 'subheading') {
    return `<h3 class="subtitle" style="${formatStyle(node.format)}">${escapeHtml(node.content)}</h3>`;
  }
  return `<p style="${formatStyle(node.format)}"><span class="para-num">${node.paragraphNumber}.</span> ${renderInline(node.content)}</p>`;
}

function hasFeature(features: Feature[], feature: Feature): boolean {
  return features.includes(feature);
}

export function renderHtml(
  doc: DocumentAST,
  meta: { case_number: string; date: string; author: { role: string; name: string } }
): string {
  const { margins, features, title, nodes } = doc;

  const headerCenterParts: string[] = [];
  if (hasFeature(features, 'title')) headerCenterParts.push(`<div class="header-title">${escapeHtml(title)}</div>`);
  if (hasFeature(features, 'author')) headerCenterParts.push(`<div class="header-author">${escapeHtml(meta.author.role)} ${escapeHtml(meta.author.name)}</div>`);

  const headerRightParts: string[] = [];
  if (hasFeature(features, 'case_number')) headerRightParts.push(`<div class="header-case">${escapeHtml(meta.case_number)}</div>`);
  if (hasFeature(features, 'date')) headerRightParts.push(`<div class="header-date">${escapeHtml(meta.date)}</div>`);

  const showHeader = headerCenterParts.length > 0 || headerRightParts.length > 0;

  const header = showHeader
    ? `<header class="doc-header">
        <div class="header-center">${headerCenterParts.join('\n')}</div>
        <div class="header-right">${headerRightParts.join('\n')}</div>
      </header>`
    : '';

  const pageNumberCss = hasFeature(features, 'page_number')
    ? `@bottom-center { content: counter(page); font-family: 'Times New Roman', Times, serif; font-size: 12pt; }`
    : '';

  const footer = hasFeature(features, 'page_number')
    ? `<footer class="doc-footer"></footer>`
    : '';

  return template
    .replace('{{PAGE_MARGINS}}', `${margins.top}pt ${margins.right}pt ${margins.bottom}pt ${margins.left}pt`)
    .replace('{{PAGE_NUMBER_CSS}}', pageNumberCss)
    .replace('{{HEADER}}', header)
    .replace('{{BODY}}', nodes.map(renderNode).join('\n'))
    .replace('{{FOOTER}}', footer);
}
