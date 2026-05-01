[**legal-doc-compiler**](../../README.md)

***

[legal-doc-compiler](../../modules.md) / [inputSchema](../README.md) / Content

# Type Alias: Content

> **Content** = `string` \| \{ `subTitle?`: `string`; `text`: `string`; `type`: `"heading"`; \} \| \{ `text`: `string`; `type`: `"paragraph"`; \}

Defined in: inputSchema.ts:133

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

\{ `text`: `string`; `type`: `"paragraph"`; \}
