import { shell as Shell } from 'shell'
import { join as pathjoin } from 'node:path'

const shell = Shell({
  name: 'legal-doc-gen.ts',
  description: 'Generate legal documents from yaml files',
  options: {
    outdir: {
      description: 'Directory to output files',
      shortcut: 'o',
      type: 'string',
      default: 'out',
    },
    file: {
      description: 'Filename',
      shortcut: 'f',
      type: 'string',
      default: 'out/example.yaml',
    },
  },
  commands: {
    gen: {
      description: 'Generate an example',
      options: {
        amount: {
          description: 'Number of docs to generate',
          shortcut: 'a',
          type: 'integer',
          default: 10
        }
      },
      handler: pathjoin(__dirname, '..', 'example-gen.ts'),
    },
    doc: {
      description: 'Generate the document',
      handler: pathjoin(__dirname, '..', 'compile-doc.ts'),
    },
    watch: {
      description: 'Watch for template/input changes and auto-compile with dev server',
      options: {
        port: {
          description: 'Port for dev server',
          shortcut: 'p',
          type: 'integer',
          default: 5173
        },
        'no-server': {
          description: 'Disable dev server (watch-only mode)',
          type: 'boolean',
          default: false
        }
      },
      handler: pathjoin(__dirname, '..', 'watch-doc.ts'),
    }
  },
})

shell.route()
