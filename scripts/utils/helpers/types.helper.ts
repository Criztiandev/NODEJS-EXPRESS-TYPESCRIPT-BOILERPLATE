export type SchemaType =
  | StringConstructor
  | DateConstructor
  | NumberConstructor
  | BooleanConstructor;

export interface SchemaField {
  required: boolean;
  type: SchemaType;
}

export type Schema = Record<string, SchemaField>;
