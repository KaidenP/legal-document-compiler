import { readFile } from 'node:fs/promises';
import { parse } from './parser/index.ts';
import { resolve } from './resolver/index.ts';
import { applyFormatting } from './formatter/index.ts';
import { renderDocument } from './renderer/index.ts';
import * as yaml from 'js-yaml';
import type { YamlInput } from './types/input.ts';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const inputFile = args.find(a => !a.startsWith('--'));
  const htmlFlag = args.includes('--html');

  if (!inputFile) {
    process.stderr.write('Usage: bun run generate <input.yaml> [--html]\n');
    process.exit(1);
  }

  let yamlString: string;
  try {
    yamlString = await readFile(inputFile, 'utf-8');
  } catch {
    process.stderr.write(`Error: cannot read file "${inputFile}"\n`);
    process.exit(1);
  }

  let parsed: ReturnType<typeof parse>;
  try {
    parsed = parse(yamlString);
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }

  const rawInput = yaml.load(yamlString) as YamlInput;

  let resolved: ReturnType<typeof resolve>;
  try {
    resolved = resolve(parsed.documents, parsed.defaults);
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }

  let formatted: ReturnType<typeof applyFormatting>;
  try {
    formatted = applyFormatting(resolved, parsed.defaults, rawInput.documents);
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }

  for (const doc of formatted) {
    try {
      await renderDocument(doc, parsed.defaults, { html: htmlFlag });
      process.stdout.write(`Written: ${doc.outputFile}\n`);
    } catch (err) {
      process.stderr.write(`Error rendering "${doc.id}": ${err instanceof Error ? err.message : String(err)}\n`);
      process.exit(1);
    }
  }
}

main();
