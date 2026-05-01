[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / Input

# Type Alias: Input

> **Input** = \{ `features?`: \{ `pageNumbers?`: `boolean`; \}; `properties?`: \{ `author?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `case_name?`: `string`; `case_number?`: `string`; `date?`: `Date`; `submitted_by?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `title?`: `string`; \}; `type`: `"globals"`; `version`: `string`; \} \| \{ `content`: (`string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `text`: `string`; `type`: `"paragraph"`; \})[]; `features?`: \{ `pageNumbers?`: `boolean`; \}; `id?`: `string`; `properties?`: \{ `author?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `case_name?`: `string`; `case_number?`: `string`; `date?`: `Date`; `submitted_by?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `title?`: `string`; \}; `title`: `string`; `type`: `"document"`; `version`: `string`; \}

Defined in: inputSchema.ts:154

## Union Members

### Type Literal

\{ `features?`: \{ `pageNumbers?`: `boolean`; \}; `properties?`: \{ `author?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `case_name?`: `string`; `case_number?`: `string`; `date?`: `Date`; `submitted_by?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `title?`: `string`; \}; `type`: `"globals"`; `version`: `string`; \}

#### features?

> `optional` **features?**: `object`

Document rendering features configuration. See: [\`DocumentFeatures\`](DocumentFeatures.md)

##### features.pageNumbers?

> `optional` **pageNumbers?**: `boolean`

Whether to display page numbers in the rendered document

#### properties?

> `optional` **properties?**: `object`

Optional document properties See: [\`DocumentProperties\`](DocumentProperties.md)

##### properties.author?

> `optional` **author?**: `object`

Optional author information See: [\`Author\`](Author.md)

##### properties.author.name

> **name**: `string`

Full name of the author

##### properties.author.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

##### properties.case\_name?

> `optional` **case\_name?**: `string`

Optional case/reference number

##### properties.case\_number?

> `optional` **case\_number?**: `string`

Optional case/reference number

##### properties.date?

> `optional` **date?**: `Date`

Optional document date

##### properties.submitted\_by?

> `optional` **submitted\_by?**: `object`

Optional submission information See: [\`Author\`](Author.md)

##### properties.submitted\_by.name

> **name**: `string`

Full name of the author

##### properties.submitted\_by.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

##### properties.title?

> `optional` **title?**: `string`

Optional document title

#### type

> **type**: `"globals"`

#### version

> **version**: `string` = `Version`

Document version following semantic versioning See: [\`Version\`](Version.md)

***

### Type Literal

\{ `content`: (`string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `text`: `string`; `type`: `"paragraph"`; \})[]; `features?`: \{ `pageNumbers?`: `boolean`; \}; `id?`: `string`; `properties?`: \{ `author?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `case_name?`: `string`; `case_number?`: `string`; `date?`: `Date`; `submitted_by?`: \{ `name`: `string`; `role`: `"Respondent"` \| `"Applicant"` \| `"Third-Party"`; \}; `title?`: `string`; \}; `title`: `string`; `type`: `"document"`; `version`: `string`; \}

#### content

> **content**: (`string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `text`: `string`; `type`: `"paragraph"`; \})[]

Array of content elements (headings, subheadings, paragraphs) See: [\`Content\`](Content.md)

#### features?

> `optional` **features?**: `object`

Document rendering features configuration. See: [\`DocumentFeatures\`](DocumentFeatures.md)

##### features.pageNumbers?

> `optional` **pageNumbers?**: `boolean`

Whether to display page numbers in the rendered document

#### id?

> `optional` **id?**: `string`

Unique identifier (auto-generated UUID if not provided) See: [\`EntryID\`](EntryID.md)

#### properties?

> `optional` **properties?**: `object`

Optional document properties See: [\`DocumentProperties\`](DocumentProperties.md)

##### properties.author?

> `optional` **author?**: `object`

Optional author information See: [\`Author\`](Author.md)

##### properties.author.name

> **name**: `string`

Full name of the author

##### properties.author.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

##### properties.case\_name?

> `optional` **case\_name?**: `string`

Optional case/reference number

##### properties.case\_number?

> `optional` **case\_number?**: `string`

Optional case/reference number

##### properties.date?

> `optional` **date?**: `Date`

Optional document date

##### properties.submitted\_by?

> `optional` **submitted\_by?**: `object`

Optional submission information See: [\`Author\`](Author.md)

##### properties.submitted\_by.name

> **name**: `string`

Full name of the author

##### properties.submitted\_by.role

> **role**: `"Respondent"` \| `"Applicant"` \| `"Third-Party"` = `AuthorRole`

The role of the author (Respondent or Applicant) See: [\`AuthorRole\`](AuthorRole.md)

##### properties.title?

> `optional` **title?**: `string`

Optional document title

#### title

> **title**: `string`

Document title (required)

#### type

> **type**: `"document"`

#### version

> **version**: `string` = `Version`

Document version following semantic versioning See: [\`Version\`](Version.md)
