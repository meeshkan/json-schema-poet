import {
  JSFCInteger,
  JSFCNumber,
  JSFCString,
  JSFCRegex,
  JSFCBoolean,
  JSFCArray,
  JSFCObject,
  JSONSchemaObject,
  JSFCTopLevelBoolean
} from "json-schema-fast-check/dist/generated/json-schema-strict";
import * as io from "io-ts";

interface IntProps {
  mininum: number;
  maximum: number;
  exclusiveMinimum: boolean;
  exclusiveMaximum: boolean;
}

interface NumberProps {
  mininum: number;
  maximum: number;
}

interface ObjectProps {
  properties: {
    [k: string]: Everything;
  };
  additionalProperties: boolean | Everything;
  patternProperties: {
    [k: string]: Everything;
  };
}

const JSONPrimitive = io.union([io.number, io.boolean, io.string, io.null]);
const JSONValue: io.Type<JSONValue> = io.recursion("JSONValue", () =>
  io.union([JSONPrimitive, JSONObject, JSONArray])
);
const JSONObject: io.Type<JSONObject> = io.recursion("JSONObject", () =>
  io.record(io.string, JSONValue)
);
const JSONArray: io.Type<JSONArray> = io.recursion("JSONArray", () =>
  io.array(JSONValue)
);

export type JSONPrimitive = number | boolean | string | null;
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;
export type JSONObject = {
  [k: string]: JSONValue;
};
export interface JSONArray extends Array<JSONValue> {}

const JSFCIntegerTag: unique symbol = Symbol();
const JSFCNumberTag: unique symbol = Symbol();
const JSFCStringTag: unique symbol = Symbol();
const JSFCRegexTag: unique symbol = Symbol();
const JSFCBooleanTag: unique symbol = Symbol();
const JSFCArrayTag: unique symbol = Symbol();
const JSFCObjectTag: unique symbol = Symbol();

interface JSFCIntegerTagged {
  tag: typeof JSFCIntegerTag;
  payload: JSFCInteger;
}
interface JSFCNumberTagged {
  tag: typeof JSFCNumberTag;
  payload: JSFCNumber;
}
interface JSFCBooleanTagged {
  tag: typeof JSFCBooleanTag;
  payload: JSFCBoolean;
}
interface JSFCRegexTagged {
  tag: typeof JSFCRegexTag;
  payload: JSFCRegex;
}
interface JSFCStringTagged {
  tag: typeof JSFCStringTag;
  payload: JSFCString;
}
interface JSFCArrayTagged {
  tag: typeof JSFCArrayTag;
  payload: JSFCArray;
}
interface JSFCObjectTagged {
  tag: typeof JSFCObjectTag;
  payload: JSFCObject;
}

const iss = <T>(t: Symbol) => (u: unknown): u is T =>
  typeof u === "object" && (<any>u).tag === t;

type Everything =
  | JSONValue
  | JSFCIntegerTagged
  | JSFCNumberTagged
  | JSFCStringTagged
  | JSFCRegexTagged
  | JSFCBooleanTagged
  | JSFCObjectTagged
  | JSFCArrayTagged;

export const integer = (props?: Partial<IntProps>): JSFCIntegerTagged => ({
  tag: JSFCIntegerTag,
  payload: { type: "integer", ...(props || {}) }
});
export const number = (props?: Partial<NumberProps>): JSFCNumberTagged => ({
  tag: JSFCNumberTag,
  payload: { type: "number", ...(props || {}) }
});
export const string = (): JSFCStringTagged => ({
  tag: JSFCStringTag,
  payload: { type: "string" }
});
export const regex = (pattern: string): JSFCRegexTagged => ({
  tag: JSFCRegexTag,
  payload: { type: "string", pattern }
});
export const boolean = (): JSFCBooleanTagged => ({
  tag: JSFCBooleanTag,
  payload: { type: "boolean" }
});
export const array = (items: Everything): JSFCArrayTagged => ({
  tag: JSFCArrayTag,
  payload: { type: "array", items: defunc(items) }
});
export const object = (props?: Partial<ObjectProps>): JSFCObjectTagged => ({
  tag: JSFCObjectTag,
  payload: {
    type: "object",
    properties: Object.entries(props ? props.properties || {} : {})
      .map(([a, b]) => ({ [a]: defunc(b) }))
      .reduce((a, b) => ({ ...a, ...b }), {})
  }
});

const defunc = (input: Everything) =>
  JSONValue.is(input) ? { const: input } : input.payload;
export const poet = defunc;
