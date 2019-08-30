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
  JSFCConst
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
  payload: (r: EverythingRec) => ({ type: "array", items: defunc(items, r) })
});
export const dictionary = (vals: Everything): JSFCObjectTagged =>
  object({ additionalProperties: vals });
export const object = (props?: Partial<ObjectProps>): JSFCObjectTagged => ({
  tag: JSFCObjectTag,
  payload: (r: EverythingRec) => ({
    type: "object",
    ...(props && props.required ? { required: props.required } : {}),
    ...(props && props.properties
      ? {
          properties: Object.entries(props.properties)
            .map(([a, b]) => ({ [a]: defunc(b, r) }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        }
      : {}),
    ...(props && props.patternProperties
      ? {
          patternProperties: Object.entries(props.patternProperties)
            .map(([a, b]) => ({ [a]: defunc(b, r) }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        }
      : {}),
    ...(props && props.additionalProperties
      ? {
          additionalProperties:
            typeof props.additionalProperties === "boolean"
              ? props.additionalProperties
              : defunc(props.additionalProperties, r)
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
    <JSONSchemaObject>{ ...defunc(what, r), [key]: v }
});

const defunc = (input: Everything, store?: EverythingRec): JSONSchemaObject =>
  JSONValue.is(input)
    ? { const: input }
    : input.tag === NeedsTag
    ? defunc(input.payload(store || {}), store)
    : input.tag === JSFCObjectTag ||
      input.tag == JSFCArrayTag ||
      input.tag == ExtendTag
    ? input.payload(store || {})
    : input.payload;

export const poet = defunc;
