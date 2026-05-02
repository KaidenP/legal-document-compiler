import { shell as Shell } from 'shell'
import { join, normalize } from 'node:path'

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
      default: normalize(join(__dirname, '..', 'examples', 'fixtures', 'example.yaml')),
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
          default: 1
        }
      },
      handler: join(import.meta.dir, '..', 'examples', 'generator.ts'),
    },
    doc: {
      description: 'Generate the document',
      handler: join(import.meta.dir, '..', 'compiler', 'document-compiler.ts'),
      options: {
        watch: {
          description: 'Start HTTP server for watching',
          shortcut: 'w',
          type: 'boolean',
          default: false
        }
      },
    },
  },
})

shell.route()
