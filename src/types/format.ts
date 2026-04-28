/**
 * Represents a resolved format rule with all formatting properties applied.
 * Contains font size, text styling, and spacing information ready for rendering.
 *
 * @interface ResolvedFormatRule
 *
 * @property {number} pt - Font size in points
 * @property {boolean} bold - Whether the text should be bold
 * @property {boolean} italic - Whether the text should be italic
 * @property {ResolvedSpacing} spacing - Spacing configuration for the formatted text
 *
 * @example
 * const rule: ResolvedFormatRule = {
 *   pt: 12,
 *   bold: true,
 *   italic: false,
 *   spacing: { between: 0, after: 6, collapseWithPrevious: false }
 * };
 */
export interface ResolvedFormatRule {
  pt: number;
  bold: boolean;
  italic: boolean;
  spacing: ResolvedSpacing;
}

export interface ResolvedSpacing {
  between: number;
  after: number;
  collapseWithPrevious: boolean;
}

export interface ResolvedMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
