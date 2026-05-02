[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / Content

# Type Alias: Content

> **Content** = `string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `number?`: `number`; `text`: `string`; `type`: `"paragraph"`; \}

Defined in: [schemas/document-schema.ts:153](https://github.com/KaidenP/legal-document-compiler/blob/100d36bd4761da800ae4d3023ba36b4c1d708a66/src/schemas/document-schema.ts#L153)

Union of all content element types: headings, subheadings, and paragraphs.

See:
- [ContentHeading](../variables/ContentHeading.md)
- [ContentParagraph](../variables/ContentParagraph.md)

## Union Members

`string`

***

### Type Literal

\{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \}

#### subTitle?

> `optional` **subTitle?**: `string`

#### text

> **text**: `string`

The heading text

#### type

> **type**: `"heading"`

Content type identifier

***

### Type Literal

\{ `number?`: `number`; `text`: `string`; `type`: `"paragraph"`; \}
