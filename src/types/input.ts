export interface YamlInput {
  defaults: YamlDefaults;
  documents: YamlDocument[];
}

export interface YamlDefaults {
  case_number: string;
  date: string;
  author: YamlAuthor;
  features?: Feature[];
  margins?: YamlMargins;
  format?: YamlFormatConfig;
}

export interface YamlAuthor {
  role: string;
  name: string;
}

export type Feature = 'page_number' | 'case_number' | 'date' | 'title' | 'author';

export interface YamlMargins {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface YamlFormatConfig {
  defaults?: YamlFormatRule;
  overrides?: Partial<Record<ContentType, YamlFormatRule>>;
}

export interface YamlFormatRule {
  pt?: number;
  bold?: boolean;
  italic?: boolean;
  spacing?: YamlSpacing;
}

export interface YamlSpacing {
  between?: number;
  after?: number;
  collapse_with_previous?: boolean;
}

export interface YamlDocument {
  id: string;
  title: string;
  output_file?: string;
  features?: Feature[];
  margins?: YamlMargins;
  format?: YamlFormatConfig;
  content: YamlContentItem[];
}

export type YamlContentItem = string | YamlContentObject;

export interface YamlContentObject {
  type?: ContentType;
  content?: string | YamlContentItem[];
  id?: string;
  ref?: string;
  template?: string;
  format?: YamlFormatRule;
}

export type ContentType = 'heading' | 'subheading' | 'paragraph' | 'reference';
