export interface Attribute {
  name?: string;
}
export interface AttributeValue {
  type?: string;
  value?: string;
}
export interface AttributeSet {
  type?: string;
  category?: string;
  attributes?: Attribute[];
}
