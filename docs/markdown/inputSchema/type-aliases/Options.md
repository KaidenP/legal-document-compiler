[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / Options

# Type Alias: Options

> **Options** = `object`

Defined in: inputSchema.ts:92

Base document options including version, type, and optional properties.

## Type Declaration

### features?

> `optional` **features?**: `object`

Document rendering features configuration. See: [\`DocumentFeatures\`](DocumentFeatures.md)

#### features.pageNumbers?

> `optional` **pageNumbers?**: `boolean`

Whether to display page numbers in the rendered document

### properties?

> `optional` **properties?**: `object`

Optional document properties See: [\`DocumentProperties\`](DocumentProperties.md)

#### properties.author?

> `optional` **author?**: `object`

Optional author information See: [\`Author\`](Author.md)

#### properties.author.name

> **name**: `string`

Full name of the author

#### properties.author.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

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

Optional submission information See: [\`Author\`](Author.md)

#### properties.submitted\_by.name

> **name**: `string`

Full name of the author

#### properties.submitted\_by.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

#### properties.title?

> `optional` **title?**: `string`

Optional document title

### type

> **type**: `"globals"` \| `"document"` = `EntryType`

Type of entry (globals or document) See: [\`EntryType\`](EntryType.md)

### version

> **version**: `string` = `Version`

Document version following semantic versioning See: [\`Version\`](Version.md)
