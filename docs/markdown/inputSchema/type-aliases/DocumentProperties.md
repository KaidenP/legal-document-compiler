[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / DocumentProperties

# Type Alias: DocumentProperties

> **DocumentProperties** = `object`

Defined in: [schemas/document-schema.ts:43](https://github.com/KaidenP/legal-document-compiler/blob/100d36bd4761da800ae4d3023ba36b4c1d708a66/src/schemas/document-schema.ts#L43)

Document properties containing metadata about the legal document.

## Type Declaration

### author?

> `optional` **author?**: `object`

Optional author information See: [:type \| \`Author\`](../variables/Author.md)

#### author.name

> **name**: `string`

Full name of the author

#### author.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../variables/AuthorRole.md)

### case\_name?

> `optional` **case\_name?**: `string`

Optional case/reference number

### case\_number?

> `optional` **case\_number?**: `string`

Optional case/reference number

### date?

> `optional` **date?**: `Date`

Optional document date

### submitted\_by?

> `optional` **submitted\_by?**: `object`

Optional submission information See: [:type \| \`Author\`](../variables/Author.md)

#### submitted\_by.name

> **name**: `string`

Full name of the author

#### submitted\_by.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [:type \| \`AuthorRole\`](../variables/AuthorRole.md)

### title?

> `optional` **title?**: `string`

Optional document title
