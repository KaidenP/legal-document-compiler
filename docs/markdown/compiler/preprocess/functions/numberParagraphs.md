[**legal-doc-compiler**](../../../README.md)

***

[legal-doc-compiler](../../../modules.md) / [compiler/preprocess](../README.md) / numberParagraphs

# Function: numberParagraphs()

> **numberParagraphs**(`doc`): `object`

Defined in: [compiler/preprocess.ts:3](https://github.com/KaidenP/legal-document-compiler/blob/100d36bd4761da800ae4d3023ba36b4c1d708a66/src/compiler/preprocess.ts#L3)

## Parameters

### doc

#### content

(`string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `number?`: `number`; `text`: `string`; `type`: `"paragraph"`; \})[] = `...`

Array of content elements (headings, subheadings, paragraphs) See: [:type \| \`Content\`](../../../inputSchema/variables/Content.md)

#### features?

\{ `docID?`: `boolean`; `initialsField?`: `boolean`; `pageNumbers?`: `boolean`; `signatoryPage?`: `false` \| \{ `applicant?`: `boolean`; `includeCounsel`: `boolean`; `respondent?`: `boolean`; \}; \} = `...`

Document rendering features configuration. See: [:type \| \`DocumentFeatures\`](../../../inputSchema/variables/DocumentFeatures.md)

#### features.docID?

`boolean` = `...`

Whether to display the document ID in the bottom-left corner

#### features.initialsField?

`boolean` = `...`

Whether to display the initials field in the bottom-right corner

#### features.pageNumbers?

`boolean` = `...`

Whether to display page numbers in the rendered document

#### features.signatoryPage?

`false` \| \{ `applicant?`: `boolean`; `includeCounsel`: `boolean`; `respondent?`: `boolean`; \} = `...`

Signatory page configuration - omit or set to false to disable

#### id?

`string` = `...`

Unique identifier (auto-generated UUID if not provided) See: [:type \| \`EntryID\`](../../../inputSchema/variables/EntryID.md)

#### properties?

\{ `author?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `case_name?`: `string`; `case_number?`: `string`; `date?`: `Date`; `submitted_by?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `title?`: `string`; \} = `...`

Optional document properties See: [:type \| \`DocumentProperties\`](../../../inputSchema/variables/DocumentProperties.md)

#### properties.author?

\{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \} = `...`

Optional author information See: [:type \| \`Author\`](../../../inputSchema/variables/Author.md)

#### properties.author.name

`string` = `...`

Full name of the author

#### properties.author.role

`"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../../../inputSchema/variables/AuthorRole.md)

#### properties.case_name?

`string` = `...`

Optional case/reference number

#### properties.case_number?

`string` = `...`

Optional case/reference number

#### properties.date?

`Date` = `...`

Optional document date

#### properties.submitted_by?

\{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \} = `...`

Optional submission information See: [:type \| \`Author\`](../../../inputSchema/variables/Author.md)

#### properties.submitted_by.name

`string` = `...`

Full name of the author

#### properties.submitted_by.role

`"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../../../inputSchema/variables/AuthorRole.md)

#### properties.title?

`string` = `...`

Optional document title

#### title

`string` = `...`

Document title (required)

#### type

`"document"` = `...`

#### version

`string` = `Version`

Document version following semantic versioning See: [:type \| \`Version\`](../../../inputSchema/variables/Version.md)

## Returns

### content

> **content**: (`string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `number?`: `number`; `text`: `string`; `type`: `"paragraph"`; \})[]

Array of content elements (headings, subheadings, paragraphs) See: [:type \| \`Content\`](../../../inputSchema/variables/Content.md)

### features?

> `optional` **features?**: `object`

Document rendering features configuration. See: [:type \| \`DocumentFeatures\`](../../../inputSchema/variables/DocumentFeatures.md)

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

Unique identifier (auto-generated UUID if not provided) See: [:type \| \`EntryID\`](../../../inputSchema/variables/EntryID.md)

### properties?

> `optional` **properties?**: `object`

Optional document properties See: [:type \| \`DocumentProperties\`](../../../inputSchema/variables/DocumentProperties.md)

#### properties.author?

> `optional` **author?**: `object`

Optional author information See: [:type \| \`Author\`](../../../inputSchema/variables/Author.md)

#### properties.author.name

> **name**: `string`

Full name of the author

#### properties.author.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../../../inputSchema/variables/AuthorRole.md)

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

Optional submission information See: [:type \| \`Author\`](../../../inputSchema/variables/Author.md)

#### properties.submitted\_by.name

> **name**: `string`

Full name of the author

#### properties.submitted\_by.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../../../inputSchema/variables/AuthorRole.md)

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

Document version following semantic versioning See: [:type \| \`Version\`](../../../inputSchema/variables/Version.md)
