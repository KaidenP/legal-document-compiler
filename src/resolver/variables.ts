/**
 * Context object containing template variables for document substitution.
 *
 * Provides the data required to replace template placeholders in legal documents
 * with actual values. All fields are required for proper template processing.
 *
 * @interface TemplateContext
 * @example
 * const context: TemplateContext = {
 *   author: 'John Doe',
 *   title: 'Service Agreement',
 *   date: '2026-04-28',
 *   paragraph: 'Terms and conditions...'
 * };
 */
export interface TemplateContext {
  /** The author or creator of the document. */
  author: string;
  /** The title or name of the document. */
  title: string;
  /** The date associated with the document (typically creation or effective date). */
  date: string;
  /** The main content or paragraph text to be substituted into the template. */
  paragraph: string;
}

export function substituteTemplate(template: string, ctx: TemplateContext): string {
  return template
    .replace(/\{\{author\}\}/g, ctx.author)
    .replace(/\{\{title\}\}/g, ctx.title)
    .replace(/\{\{date\}\}/g, ctx.date)
    .replace(/\{\{paragraph\}\}/g, ctx.paragraph);
}
