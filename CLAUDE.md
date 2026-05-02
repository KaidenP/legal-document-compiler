# Legal Document Compiler - Developer Guide

A TypeScript-based CLI tool for compiling legal documents from YAML definitions into HTML and PDF formats.

## Quick Start

```bash
bun install
bun run src/cli/legal-doc-gen.ts --help
```

## Project Structure

- **`src/cli/legal-doc-gen.ts`** — CLI entry point with command routing
- **`src/compiler/document-compiler.ts`** — Main document compilation logic
  - Loads YAML files with global settings and document definitions
  - Validates input against schemas
  - Orchestrates HTML/PDF rendering
  - Supports watch mode with hot reload
- **`src/renderer/`** — Output renderers
  - `html-renderer.ts` — Handlebars-based HTML rendering
  - `pdf-renderer.ts` — Puppeteer-based PDF generation from HTML
- **`src/schemas/document-schema.ts`** — Zod validators for document structure
- **`src/templates/`** — Handlebars templates and styles
  - `document.hbs` — Main document template
  - `viewer.hbs` — HTML viewer template
  - `stylesheets/` — CSS for documents and viewer
- **`src/examples/`** — Example generation and fixtures
  - `fixtures/example.yaml` — Sample document with globals and content
  - `generator.ts` — Creates random legal documents for testing
- **`src/utils/`** — Utility functions
- **`src/compiler/preprocess.ts`** — Preprocessing logic (e.g., paragraph numbering)
- **`src/compiler/watch-server.ts`** — HTTP server for watch mode

## Commands

### Generate Examples

```bash
bun run src/cli/legal-doc-gen.ts gen --amount 5
```

Generates random legal documents in the `out/` directory. Use `-o/--outdir` to specify output directory.

### Compile Documents

```bash
bun run src/cli/legal-doc-gen.ts doc -f input.yaml
bun run src/cli/legal-doc-gen.ts doc -f input.yaml -w  # Watch mode
bun run src/cli/legal-doc-gen.ts doc --pdf false       # HTML only
bun run src/cli/legal-doc-gen.ts doc --html false      # PDF only
```

Options:
- `-f/--file` — YAML input file (default: `example.yaml`)
- `-o/--outdir` — Output directory (default: `out`)
- `-w/--watch` — Start HTTP server and watch for changes
- `--pdf` — Build PDFs (default: true)
- `--html` — Build HTMLs (default: true)

## YAML Format

Documents are defined in YAML with two types of entries:

### Globals (optional, must be first)

```yaml
---
version: 0.0.0
type: globals
properties:
  author:
    name: John Doe
    role: Respondent
  case_name: Smith v. Jones
  case_number: FC-16-12345678-1234
  date: '2024-05-02'
```

### Documents

```yaml
---
version: 0.0.0
type: document
title: Document Title
id: 9eb06217-0df3-4e2d-b2be-3d55135659d4
features:
  docID: true              # Show document ID
  initialsField: true      # Add initials field on each page
  pageNumbers: true        # Add page numbers
  signatoryPage:
    applicant: true        # Applicant signature block
    respondent: true       # Respondent signature block
    includeCounsel: true   # Include counsel signatures
content:
  - type: heading
    text: Section Title
  - Plain paragraph text with support for multiline strings
  - Another paragraph
```

Content items can be:
- Plain strings (rendered as paragraphs)
- Objects with `type: heading` and `text` property

## Key Concepts

### Globals Merging

Global properties from the first document are merged into each document's metadata. This allows defining common metadata once.

### Schema Validation

All input is validated against Zod schemas in `src/schemas/document-schema.ts`. Invalid documents will cause compilation to fail with validation errors.

### Feature Flags

The `features` object controls document layout:
- `docID` — Displays the document's UUID
- `initialsField` — Adds space for initialing on each page
- `pageNumbers` — Shows page numbers
- `signatoryPage` — Controls signature section on final page

### Watch Mode

With `-w/--watch`, a live-reload server starts on `http://localhost:3000`. Changes to the input YAML or templates automatically recompile and reload the browser.

### Paragraph Numbering

The `numberParagraphs` preprocessing function can add sequential numbering to paragraphs. Hook into the compilation pipeline in `document-compiler.ts` if needed.

## Dependencies

- **handlebars** — Template rendering
- **js-yaml** — YAML parsing
- **puppeteer** — PDF generation via headless Chrome
- **zod** — Schema validation
- **shell** — CLI routing and command handling
- **lorem-ipsum** — Example data generation
- **typedoc** — API documentation generation

## Development

### Code Style

- Format with Prettier: `bun run format`
- Check formatting: `bun run format-check`
- Generate TypeDoc: `bun run typedoc`

### Testing

```bash
bun test
```

### Patching Dependencies

A patch for `shell@0.12.0` is applied via `patch-package` during install (see `patches/shell+0.12.0.patch`).

## Common Tasks

**Add a new document feature flag:**
1. Update `DocumentFeatures` schema in `src/schemas/document-schema.ts`
2. Update template logic in `src/templates/document.hbs`
3. Update `features` example in `src/examples/fixtures/example.yaml`

**Customize styling:**
- Edit `src/templates/stylesheets/document.css` for printed documents
- Edit `src/templates/stylesheets/viewer.css` for HTML viewer

**Modify output naming:**
- Check `document-compiler.ts` for output filename construction
- File naming pattern: `{title} - {role} - {author} - {date}.{ext}`

## Architecture Notes

The compilation pipeline:
1. Load YAML file (`loadAll` from js-yaml)
2. Extract globals if first entry is `type: globals`
3. Validate each document against schema
4. Deep merge globals into document properties
5. Preprocess content (e.g., number paragraphs)
6. Render to HTML via Handlebars
7. Optionally render PDF from HTML via Puppeteer
8. Write outputs to disk

Globals are only merged once at the start of compilation, not per-document, so changes to globals don't retroactively update already-processed documents.
