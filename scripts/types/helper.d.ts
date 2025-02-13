// types.helper.ts
import { Document } from "mongoose";

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface BaseFields {
  createdAt: Date;
  updatedAt: Date;
}

export interface Schema {
  [key: string]: {
    type: {
      name:
        | "String"
        | "Number"
        | "Date"
        | "Boolean"
        | "ObjectID"
        | "Array"
        | "Mixed"
        | "Map"
        | string;
    };
    required: boolean;
  };
}

// Replace const with type
export type TypeMapping = {
  String: "string";
  Number: "number";
  Date: "Date";
  Boolean: "boolean";
  ObjectID: "string";
  Array: "any[]";
  Mixed: "any";
  Map: "Record<string, any>";
};
