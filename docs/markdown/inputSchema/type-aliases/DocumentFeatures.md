[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / DocumentFeatures

# Type Alias: DocumentFeatures

> **DocumentFeatures** = `object`

Defined in: [schemas/document-schema.ts:82](https://github.com/KaidenP/legal-document-compiler/blob/100d36bd4761da800ae4d3023ba36b4c1d708a66/src/schemas/document-schema.ts#L82)

Type definition for document features configuration.

## Type Declaration

### docID?

> `optional` **docID?**: `boolean`

Whether to display the document ID in the bottom-left corner

### initialsField?

> `optional` **initialsField?**: `boolean`

Whether to display the initials field in the bottom-right corner

### pageNumbers?

> `optional` **pageNumbers?**: `boolean`

Whether to display page numbers in the rendered document

### signatoryPage?

> `optional` **signatoryPage?**: `false` \| \{ `applicant?`: `boolean`; `includeCounsel`: `boolean`; `respondent?`: `boolean`; \}

Signatory page configuration - omit or set to false to disable

#### Union Members

`false`

***

##### Type Literal

\{ `applicant?`: `boolean`; `includeCounsel`: `boolean`; `respondent?`: `boolean`; \}

##### applicant?

> `optional` **applicant?**: `boolean`

Whether to display a signing block for the Applicant

##### includeCounsel

> **includeCounsel**: `boolean`

Whether to include signing lines for counsel below each party

##### respondent?

> `optional` **respondent?**: `boolean`

Whether to display a signing block for the Respondent

## See

[DocumentFeatures](../variables/DocumentFeatures.md)
