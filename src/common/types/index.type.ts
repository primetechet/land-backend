export interface searchValueType {
  type: string;
  value: string;
  parent?: string | { parent: string; value: string };
}

export interface VariableProperties<T> {
  [key: string]: T | null;
}
