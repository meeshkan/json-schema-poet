import {
  JSFCInteger,
  JSFCNumber,
  JSFCString,
  JSFCRegex,
  JSFCBoolean,
  JSFCArray,
  JSFCObject,
  JSONSchemaObject,
  JSFCNull,
  JSFCConst,
  JSFCAllOf,
  JSFCNot,
  JSFCOneOf,
  JSFCAnyOf
} from "json-schema-fast-check/dist/generated/json-schema-strict";
import * as io from "io-ts";

type EverythingRec = { [k: string]: Everything };

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
  properties: EverythingRec;
  additionalProperties: boolean | Everything;
  patternProperties: EverythingRec;
  required: string[];
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

const JSFCNullTag: unique symbol = Symbol();
const JSFCConstTag: unique symbol = Symbol();
const JSFCIntegerTag: unique symbol = Symbol();
const JSFCNumberTag: unique symbol = Symbol();
const JSFCStringTag: unique symbol = Symbol();
const JSFCRegexTag: unique symbol = Symbol();
const JSFCBooleanTag: unique symbol = Symbol();
const JSFCAllOfTag: unique symbol = Symbol();
const JSFCAnyOfTag: unique symbol = Symbol();
const JSFCOneOfTag: unique symbol = Symbol();
const JSFCNotTag: unique symbol = Symbol();
const JSFCArrayTag: unique symbol = Symbol();
const JSFCObjectTag: unique symbol = Symbol();

interface JSFCNullTagged {
  tag: typeof JSFCNullTag;
  payload: JSFCNull;
}
interface JSFCConstTagged {
  tag: typeof JSFCConstTag;
  payload: JSFCConst;
}
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
  payload: (r: EverythingRec) => JSFCArray;
}
interface JSFCAllOfTagged {
  tag: typeof JSFCAllOfTag;
  payload: (r: EverythingRec) => JSFCAllOf;
}
interface JSFCAnyOfTagged {
  tag: typeof JSFCAnyOfTag;
  payload: (r: EverythingRec) => JSFCAnyOf;
}
interface JSFCOneOfTagged {
  tag: typeof JSFCOneOfTag;
  payload: (r: EverythingRec) => JSFCOneOf;
}
interface JSFCNotTagged {
  tag: typeof JSFCNotTag;
  payload: (r: EverythingRec) => JSFCNot;
}

interface JSFCObjectTagged {
  tag: typeof JSFCObjectTag;
  payload: (r: EverythingRec) => JSFCObject;
}

type Everything =
  | JSONValue
  | JSFCConstTagged
  | JSFCNullTagged
  | JSFCIntegerTagged
  | JSFCNumberTagged
  | JSFCStringTagged
  | JSFCRegexTagged
  | JSFCBooleanTagged
  | JSFCObjectTagged
  | JSFCArrayTagged
  | JSFCAllOfTagged
  | JSFCAnyOfTagged
  | JSFCOneOfTagged
  | JSFCNotTagged
  | NeedsTagged
  | ExtendTagged;

export const nul = (): JSFCNullTagged => ({
  tag: JSFCNullTag,
  payload: { type: "null" }
});
export const cnst = (c: JSONValue): JSFCConstTagged => ({
  tag: JSFCConstTag,
  payload: { const: c }
});
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
  payload: (r: EverythingRec) => ({ type: "array", items: poet(items, r) })
});
export const allOf = (arr: Everything[]): JSFCAllOfTagged => ({
  tag: JSFCAllOfTag,
  payload: (r: EverythingRec) => ({ allOf: arr.map(i => poet(i, r)) })
});
export const anyOf = (arr: Everything[]): JSFCAnyOfTagged => ({
  tag: JSFCAnyOfTag,
  payload: (r: EverythingRec) => ({ anyOf: arr.map(i => poet(i, r)) })
});
export const oneOf = (arr: Everything[]): JSFCOneOfTagged => ({
  tag: JSFCOneOfTag,
  payload: (r: EverythingRec) => ({ oneOf: arr.map(i => poet(i, r)) })
});
export const not = (n: Everything): JSFCNotTagged => ({
  tag: JSFCNotTag,
  payload: (r: EverythingRec) => ({ not: poet(n, r) })
});

export const dictionary = (vals: Everything): JSFCObjectTagged =>
  object({ additionalProperties: vals });

export const type = (
  req: EverythingRec,
  opt: EverythingRec
): JSFCObjectTagged =>
  object({ properties: { ...req, ...opt }, required: Object.keys(req) });

export const object = (props?: Partial<ObjectProps>): JSFCObjectTagged => ({
  tag: JSFCObjectTag,
  payload: (r: EverythingRec) => ({
    type: "object",
    ...(props && props.required ? { required: props.required } : {}),
    ...(props && props.properties
      ? {
          properties: Object.entries(props.properties)
            .map(([a, b]) => ({ [a]: poet(b, r) }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        }
      : {}),
    ...(props && props.patternProperties
      ? {
          patternProperties: Object.entries(props.patternProperties)
            .map(([a, b]) => ({ [a]: poet(b, r) }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        }
      : {}),
    ...(props && props.additionalProperties
      ? {
          additionalProperties:
            typeof props.additionalProperties === "boolean"
              ? props.additionalProperties
              : poet(props.additionalProperties, r)
        }
      : {})
  })
});

const NeedsTag: unique symbol = Symbol();
interface NeedsTagged {
  tag: typeof NeedsTag;
  payload: (store: EverythingRec) => Everything;
}

export const needs = (what: string): NeedsTagged => ({
  tag: NeedsTag,
  payload: (store: EverythingRec) => {
    if (store[what] === undefined) {
      throw Error(`The key ${what} is not in the store.`);
    }
    return store[what];
  }
});

const ExtendTag: unique symbol = Symbol();
interface ExtendTagged {
  tag: typeof ExtendTag;
  payload: (store: EverythingRec) => JSONSchemaObject;
}
export const extend = (
  what: Everything,
  key: string,
  v: JSONValue
): ExtendTagged => ({
  tag: ExtendTag,
  payload: (r: EverythingRec) =>
    <JSONSchemaObject>{ ...poet(what, r), [key]: v }
});

export const poet = (
  input: Everything,
  store?: EverythingRec
): JSONSchemaObject =>
  JSONValue.is(input)
    ? { const: input }
    : input.tag === NeedsTag
    ? poet(input.payload(store || {}), store)
    : input.tag === JSFCObjectTag ||
      input.tag == JSFCArrayTag ||
      input.tag == ExtendTag ||
      input.tag == JSFCAllOfTag ||
      input.tag == JSFCAnyOfTag ||
      input.tag == JSFCOneOfTag ||
      input.tag == JSFCNotTag
    ? input.payload(store || {})
    : input.payload;
