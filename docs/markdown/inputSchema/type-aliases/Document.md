[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / Document

# Type Alias: Document

> **Document** = `object`

Defined in: [schemas/document-schema.ts:162](https://github.com/KaidenP/legal-document-compiler/blob/100d36bd4761da800ae4d3023ba36b4c1d708a66/src/schemas/document-schema.ts#L162)

Complete legal document definition extending DocumentOptions.

## Type Declaration

### content

> **content**: (`string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `number?`: `number`; `text`: `string`; `type`: `"paragraph"`; \})[]

Array of content elements (headings, subheadings, paragraphs) See: [:type \| \`Content\`](../variables/Content.md)

### features?

> `optional` **features?**: `object`

Document rendering features configuration. See: [:type \| \`DocumentFeatures\`](../variables/DocumentFeatures.md)

#### features.docID?

> `optional` **docID?**: `boolean`

Whether to display the document ID in the bottom-left corner

#### features.initialsField?

> `optional` **initialsField?**: `boolean`

Whether to display the initials field in the bottom-right corner

#### features.pageNumbers?

> `optional` **pageNumbers?**: `boolean`

Whether to display page numbers in the rendered document

#### features.signatoryPage?

> `optional` **signatoryPage?**: `false` \| \{ `applicant?`: `boolean`; `includeCounsel`: `boolean`; `respondent?`: `boolean`; \}

Signatory page configuration - omit or set to false to disable

##### Union Members

`false`

***

###### Type Literal

\{ `applicant?`: `boolean`; `includeCounsel`: `boolean`; `respondent?`: `boolean`; \}

###### applicant?

> `optional` **applicant?**: `boolean`

Whether to display a signing block for the Applicant

###### includeCounsel

> **includeCounsel**: `boolean`

Whether to include signing lines for counsel below each party

###### respondent?

> `optional` **respondent?**: `boolean`

Whether to display a signing block for the Respondent

### id?

> `optional` **id?**: `string`

Unique identifier (auto-generated UUID if not provided) See: [:type \| \`EntryID\`](../variables/EntryID.md)

### properties?

> `optional` **properties?**: `object`

Optional document properties See: [:type \| \`DocumentProperties\`](../variables/DocumentProperties.md)

#### properties.author?

> `optional` **author?**: `object`

Optional author information See: [:type \| \`Author\`](../variables/Author.md)

#### properties.author.name

> **name**: `string`

Full name of the author

#### properties.author.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../variables/AuthorRole.md)

#### properties.case\_name?

> `optional` **case\_name?**: `string`

Optional case/reference number

#### properties.case\_number?

> `optional` **case\_number?**: `string`

Optional case/reference number

#### properties.date?

> `optional` **date?**: `Date`

Optional document date

#### properties.submitted\_by?

> `optional` **submitted\_by?**: `object`

Optional submission information See: [:type \| \`Author\`](../variables/Author.md)

#### properties.submitted\_by.name

> **name**: `string`

Full name of the author

#### properties.submitted\_by.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../variables/AuthorRole.md)

#### properties.title?

> `optional` **title?**: `string`

Optional document title

### title

> **title**: `string`

Document title (required)

### type

> **type**: `"document"`

### version

> **version**: `string` = `Version`

Document version following semantic versioning See: [:type \| \`Version\`](../variables/Version.md)
