# Live Reload for Template Development

Quickly iterate on templates with automatic recompilation and hot-reload in the browser.

## Quick Start

1. **Generate example documents** (if you haven't already):
   ```bash
   bun run src/bin/legal-doc-gen.ts --file out/example.yaml gen --amount 2
   ```

2. **Start the watch server**:
   ```bash
   bun run src/bin/legal-doc-gen.ts --file out/example.yaml watch
   ```

3. **Open in browser**:
   - Navigate to `http://localhost:5173`
   - The page will auto-reload whenever you modify:
     - Template files (`src/templates/*.hbs`)
     - Stylesheet files (`src/templates/style/*.css`)
     - Input YAML files

## Features

- **Automatic recompilation**: File changes are detected every 1 second
- **Auto-reload browser**: Page refreshes automatically after compilation
- **Dev server included**: Simple HTTP server runs on port 5173 by default
- **Debounced**: Multiple file writes are batched to avoid redundant compilations

## Usage

```bash
# Start with custom port
bun run src/bin/legal-doc-gen.ts --file docs/contract.yaml watch --port 3000

# Watch-only mode (no dev server)
bun run src/bin/legal-doc-gen.ts --file docs/contract.yaml watch --no-server
```

### Options

- `--file` / `-f`: Input YAML file (default: `out/example.yaml`)
- `--outdir` / `-o`: Output directory for compiled documents (default: `out`)
- `--port` / `-p`: Port for dev server (default: `5173`)
- `--no-server`: Disable dev server, watch files only

## How It Works

1. Watches template directory and input file for changes
2. Detects changes via modification time polling (every 1 second)
3. Recompiles all documents when changes are detected
4. Dev server injects a reload script that checks for updates every 1 second
5. Browser auto-refreshes when changes are detected

## Tips

- Edit templates directly in `src/templates/document.hbs`
- Modify styles in `src/templates/style/document.css`
- Update test data by editing the YAML file
- Check browser console (F12) for any rendering issues
- Multiple documents are served—access them via `http://localhost:5173/example-0.html`, `example-1.html`, etc.
