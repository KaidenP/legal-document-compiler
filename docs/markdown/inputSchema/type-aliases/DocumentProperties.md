[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / DocumentProperties

# Type Alias: DocumentProperties

> **DocumentProperties** = `object`

Defined in: inputSchema.ts:43

Document properties containing metadata about the legal document.

## Type Declaration

### author?

> `optional` **author?**: `object`

Optional author information See: [\`Author\`](Author.md)

#### author.name

> **name**: `string`

Full name of the author

#### author.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

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

Optional submission information See: [\`Author\`](Author.md)

#### submitted\_by.name

> **name**: `string`

Full name of the author

#### submitted\_by.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

### title?

> `optional` **title?**: `string`

Optional document title
