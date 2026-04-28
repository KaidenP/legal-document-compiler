import type { DocumentAST } from '../types/ast.ts';
import type { YamlDefaults } from '../types/input.ts';
import { renderHtml } from './html.ts';
import { renderPdf } from './pdf.ts';
import { writeFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export interface RenderOptions {
  html?: boolean;
}

export async function renderDocument(
  doc: DocumentAST,
  defaults: YamlDefaults,
  options: RenderOptions = {},
): Promise<void> {
  const html = renderHtml(doc, {
    case_number: defaults.case_number,
    date: defaults.date,
    author: defaults.author,
  });

  if (options.html) {
    const htmlPath = doc.outputFile.replace(/\.pdf$/i, '.html');
    await mkdir(dirname(htmlPath), { recursive: true });
    await writeFile(htmlPath, html, 'utf-8');
  }

  await renderPdf(html, doc.outputFile);
}
