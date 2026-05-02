[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / SignatoryPageConfig

# Type Alias: SignatoryPageConfig

> **SignatoryPageConfig** = `object`

Defined in: [schemas/document-schema.ts:69](https://github.com/KaidenP/legal-document-compiler/blob/100d36bd4761da800ae4d3023ba36b4c1d708a66/src/schemas/document-schema.ts#L69)

Signatory page configuration for the last page of the document.
Controls which parties have signing blocks and whether counsel lines appear.

## Type Declaration

### applicant?

> `optional` **applicant?**: `boolean`

Whether to display a signing block for the Applicant

### includeCounsel

> **includeCounsel**: `boolean`

Whether to include signing lines for counsel below each party

### respondent?

> `optional` **respondent?**: `boolean`

Whether to display a signing block for the Respondent
