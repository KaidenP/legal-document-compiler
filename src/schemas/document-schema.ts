/**
 * Input schema definitions for legal document compilation.
 * Defines Zod validators and types for document structure, metadata, and content.
 * @module inputSchema
 * @sortStrategy source-order
 */
import { semver, version } from 'bun'
import { title } from 'node:process'
import * as z from 'zod'

/**
 * Entry type enumeration: either 'globals' for global settings or 'document' for actual documents.
 */
export const EntryType = z.enum(['globals', 'document'])
export type EntryType = z.infer<typeof EntryType>

/**
 * Entry ID: either a GUID or arbitrary string identifier for document entries.
 */
export const EntryID = z.union([z.guid(), z.string()])
export type EntryID = z.infer<typeof EntryID>

/**
 * Author role in legal document: either 'Respondent' or 'Applicant'.
 */
export const AuthorRole = z.enum(['Respondent', 'Applicant', 'Third-Party'])
export type AuthorRole = z.infer<typeof AuthorRole>

/**
 * Author information including role and name.
 */
export const Author = z.object({
  /** The role of the author (Respondent or Applicant) See: {@link AuthorRole:type | `AuthorRole`} */
  role: AuthorRole,
  /** Full name of the author */
  name: z.string(),
})
export type Author = z.infer<typeof Author>

/**
 * Document properties containing metadata about the legal document.
 */
export const DocumentProperties = z.object({
  /** Optional document title */
  title: z.string().optional(),
  /** Optional case/reference number */
  case_number: z.string().optional(),
  /** Optional case/reference number */
  case_name: z.string().optional(),
  /** Optional document date */
  date: z.coerce.date().default(new Date()).optional(),
  /** Optional author information See: {@link Author:type | `Author`} */
  author: Author.optional(),
  /** Optional submission information See: {@link Author:type | `Author`} */
  submitted_by: Author.optional(),
})
export type DocumentProperties = z.infer<typeof DocumentProperties>

/**
 * Version string following semantic versioning (0.0.x format).
 */
export const Version = z.stringFormat("version", ver => semver.satisfies(ver, '0.0.x'))
export type Version = z.infer<typeof Version>

/**
 * Configuration options that control document rendering features.
 */
export const DocumentFeatures = z.object({
  /** Whether to display page numbers in the rendered document */
  pageNumbers: z.boolean().default(true).optional(),

})
/**
 * Type definition for document features configuration.
 * @see {@link DocumentFeatures}
 */
export type DocumentFeatures = z.infer<typeof DocumentFeatures>

/**
 * Base document options including version, type, and optional properties.
 */
export const DocumentOptions = z.object({
  /** Document version following semantic versioning See: {@link Version:type | `Version`} */
  version: Version,
  /** Type of entry (globals or document) See: {@link EntryType:type | `EntryType`} */
  type: EntryType,
  /** Optional document properties See: {@link DocumentProperties:type | `DocumentProperties`} */
  properties: DocumentProperties.optional(),
  /** Document rendering features configuration. See: {@link DocumentFeatures:type | `DocumentFeatures`} */
  features: DocumentFeatures.default(DocumentFeatures.parse({})).optional(),
})
export type Options = z.infer<typeof DocumentOptions>

/**
 * Global settings entry extending DocumentOptions with type literal 'globals'.
 */
export const Globals = DocumentOptions.extend({
  type: z.literal('globals')
})
export type Globals = z.infer<typeof Globals>

/**
 * Heading content element for document structure.
 */
export const ContentHeading = z.object({
  /** Content type identifier */
  type: z.literal('heading'),
  /** The heading text */
  text: z.string(),
  subTitle: z.string().optional(),
})
export type ContentHeading = z.infer<typeof ContentHeading>

/**
 * Paragraph content element: either a plain string or an object with explicit paragraph type.
 */
export const ContentParagraph = z.union([
  z.string(),
  z.object({
    type: z.literal('paragraph').default('paragraph'),
    text: z.string()
  })
])
export type ContentParagraph = z.infer<typeof ContentParagraph>

/**
 * Union of all content element types: headings, subheadings, and paragraphs.
 *
 * See:
 * - {@link ContentHeading}
 * - {@link ContentParagraph}
 */
export const Content = z.union([
  ContentHeading,
  ContentParagraph,
])
export type Content = z.infer<typeof Content>

/**
 * Complete legal document definition extending DocumentOptions.
 */
export const Document = DocumentOptions.extend({
  type: z.literal('document'),
  /** Unique identifier (auto-generated UUID if not provided) See: {@link EntryID:type | `EntryID`} */
  id: EntryID.default(() => crypto.randomUUID()).optional(),
  /** Document title (required) */
  title: z.string(),
  /** Array of content elements (headings, subheadings, paragraphs) See: {@link Content:type | `Content`} */
  content: z.array(Content),
})

export type Document = z.infer<typeof Document>

export const Input = z.union([Globals, Document])
export type Input = z.infer<typeof Input>
