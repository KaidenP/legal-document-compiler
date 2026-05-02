# Legal Document Compiler

A CLI tool for generating and compiling legal documents from YAML specifications into HTML and PDF formats.

## Features

- **YAML-based definitions** — Define documents in simple YAML with metadata and content
- **Batch processing** — Compile multiple documents in a single run
- **HTML & PDF output** — Generate both formats or choose one
- **Watch mode** — Live-reload server for development with hot-reload support
- **Configurable layout** — Control page numbers, signature blocks, document IDs, and more
- **Template-driven** — Handlebars templates for complete customization
- **Random generation** — Generate sample legal documents for testing

## Installation

```bash
bun install
```

## Usage

### Generate Sample Documents

```bash
bun run src/cli/legal-doc-gen.ts gen --amount 5 --outdir ./out
```

Creates 5 random legal documents with lorem ipsum content in the `./out/` directory.

### Compile From YAML

```bash
bun run src/cli/legal-doc-gen.ts doc --file myfile.yaml --outdir ./out
```

Compiles documents defined in `myfile.yaml` to HTML and PDF in the `./out/` directory.

### Watch Mode

```bash
bun run src/cli/legal-doc-gen.ts doc --file myfile.yaml --watch
```

Starts a local server at `http://localhost:3000` with live reload. Changes to the YAML file or templates automatically recompile and refresh the browser.

### Options

| Option | Shortcut | Type | Default | Description |
|--------|----------|------|---------|-------------|
| `--file` | `-f` | string | `example.yaml` | Input YAML file path |
| `--outdir` | `-o` | string | `out` | Output directory |
| `--watch` | `-w` | boolean | false | Enable watch mode with live reload |
| `--pdf` | | boolean | true | Generate PDF files |
| `--html` | | boolean | true | Generate HTML files |

## Document Format

Documents are defined in YAML. You can have multiple documents in one file by separating them with `---`.

### Global Settings (optional)

Place this first to define metadata shared across all documents:

```yaml
---
version: 0.0.0
type: globals
properties:
  author:
    name: Jane Smith
    role: Respondent
  case_name: Smith v. Jones
  case_number: FC-24-123456-7890
  date: '2024-05-02'
```

### Document Definition

```yaml
---
version: 0.0.0
type: document
title: Motion for Summary Judgment
id: 550e8400-e29b-41d4-a716-446655440000
features:
  docID: true
  initialsField: true
  pageNumbers: true
  signatoryPage:
    applicant: true
    respondent: true
    includeCounsel: false
content:
  - type: heading
    text: Introduction
  - This is the first paragraph of the document.
  - This is the second paragraph with multiple sentences. It will be rendered as a single paragraph.
  - type: heading
    text: Statement of Facts
  - Additional content follows...
```

### Content Structure

The `content` array can contain:

- **Plain strings** — Rendered as paragraphs
- **Headings** — Objects with `type: heading` and `text` property
- **Multiline strings** — Use YAML folded scalars (`>-`) to wrap long text

### Features

Control document layout with the `features` object:

- **docID** (boolean) — Display the document UUID at the top
- **initialsField** (boolean) — Add a space for initials on each page
- **pageNumbers** (boolean) — Show page numbers at the bottom
- **signatoryPage** (object) — Configure the signature page
  - **applicant** (boolean) — Include applicant signature block
  - **respondent** (boolean) — Include respondent signature block
  - **includeCounsel** (boolean) — Include counsel signature lines

## Example Workflow

1. Create a YAML file with your documents:
   ```bash
   cat > mydocs.yaml << 'EOF'
   ---
   version: 0.0.0
   type: globals
   properties:
     author:
       name: John Doe
       role: Respondent
     case_name: Doe v. Smith
     date: '2024-05-15'
   
   ---
   version: 0.0.0
   type: document
   title: Affidavit
   id: 550e8400-e29b-41d4-a716-446655440000
   features:
     pageNumbers: true
     signatoryPage:
       respondent: true
   content:
     - type: heading
       text: Statement Under Oath
     - I hereby declare under penalty of perjury that the foregoing is true.
   EOF
   ```

2. Compile the documents:
   ```bash
   bun run src/cli/legal-doc-gen.ts doc --file mydocs.yaml
   ```

3. Find outputs in the `out/` directory:
   - `Affidavit - Respondent - John Doe - 2024-05-15.html`
   - `Affidavit - Respondent - John Doe - 2024-05-15.pdf`

## Development

See [CLAUDE.md](./CLAUDE.md) for architecture, customization, and development instructions.

## Scripts

```bash
bun run app          # Run the CLI
bun run test         # Run tests
bun run format       # Format code with Prettier
bun run format-check # Check code formatting
bun run typedoc      # Generate API documentation
```

## License

Private project.
