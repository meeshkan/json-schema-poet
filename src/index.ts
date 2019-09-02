import {
  JSSTInteger,
  JSSTNumber,
  JSSTString,
  JSSTRegex,
  JSSTBoolean,
  JSSTArray,
  JSSTObject,
  JSONSchemaObject,
  JSSTNull,
  JSSTConst,
  JSSTAllOf,
  JSSTNot,
  JSSTOneOf,
  JSSTAnyOf,
  JSSTStringEnum,
  JSSTIntegerEnum,
  JSSTNumberEnum
} from "json-schema-strictly-typed";
import * as io from "io-ts";

type EverythingRec<T> = { [k: string]: Everything<T> };

interface IntPropsWithMinimum {
  mininum: number;
  exclusiveMinimum?: boolean;
  multipleOf?: number;
}

interface IntPropsWithMaximum {
  maximum: number;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
}

interface IntPropsWithBounds {
  mininum: number;
  maximum: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
}

interface IntPropsWithExclusiveMinimum {
  exclusiveMinimum: number;
  multipleOf?: number;
}

interface IntPropsWithExclusiveMinimumAndMaximum {
  maximum: number;
  exclusiveMinimum: number;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
}

interface IntPropsWithExclusiveMaximum {
  exclusiveMaximum: number;
  multipleOf?: number;
}

interface IntPropsWithExclusiveMaximumAndMinimum {
  mininum: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum: number;
  multipleOf?: number;
}

interface IntPropsWithExclusiveBounds {
  mininum: number;
  maximum: number;
  exclusiveMinimum: number;
  exclusiveMaximum: number;
  multipleOf?: number;
}

type IntProps =
  | IntPropsWithMinimum
  | IntPropsWithMaximum
  | IntPropsWithBounds
  | IntPropsWithExclusiveMinimum
  | IntPropsWithExclusiveMinimumAndMaximum
  | IntPropsWithExclusiveMaximum
  | IntPropsWithExclusiveMaximumAndMinimum
  | IntPropsWithExclusiveBounds;

interface NumberProps {
  mininum: number;
  maximum: number;
}

interface ObjectProps<T> {
  properties: EverythingRec<T>;
  additionalProperties: boolean | Everything<T>;
  patternProperties: EverythingRec<T>;
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

const JSSTNullTag: unique symbol = Symbol();
const JSSTConstTag: unique symbol = Symbol();
const JSSTIntegerTag: unique symbol = Symbol();
const JSSTNumberTag: unique symbol = Symbol();
const JSSTStringTag: unique symbol = Symbol();
const JSSTStringEnumTag: unique symbol = Symbol();
const JSSTNumberEnumTag: unique symbol = Symbol();
const JSSTIntegerEnumTag: unique symbol = Symbol();
const JSSTRegexTag: unique symbol = Symbol();
const JSSTBooleanTag: unique symbol = Symbol();
const JSSTAllOfTag: unique symbol = Symbol();
const JSSTAnyOfTag: unique symbol = Symbol();
const JSSTOneOfTag: unique symbol = Symbol();
const JSSTNotTag: unique symbol = Symbol();
const JSSTArrayTag: unique symbol = Symbol();
const JSSTObjectTag: unique symbol = Symbol();

interface JSSTNullTagged {
  tag: typeof JSSTNullTag;
  payload: JSSTNull;
}
interface JSSTConstTagged {
  tag: typeof JSSTConstTag;
  payload: JSSTConst;
}
interface JSSTIntegerTagged {
  tag: typeof JSSTIntegerTag;
  payload: JSSTInteger;
}
interface JSSTNumberTagged {
  tag: typeof JSSTNumberTag;
  payload: JSSTNumber;
}
interface JSSTBooleanTagged {
  tag: typeof JSSTBooleanTag;
  payload: JSSTBoolean;
}
interface JSSTRegexTagged {
  tag: typeof JSSTRegexTag;
  payload: JSSTRegex;
}
interface JSSTStringTagged {
  tag: typeof JSSTStringTag;
  payload: JSSTString;
}
interface JSSTStringEnumTagged {
  tag: typeof JSSTStringEnumTag;
  payload: JSSTStringEnum;
}
interface JSSTNumberEnumTagged {
  tag: typeof JSSTNumberEnumTag;
  payload: JSSTNumberEnum;
}
interface JSSTIntegerEnumTagged {
  tag: typeof JSSTIntegerEnumTag;
  payload: JSSTIntegerEnum;
}
interface JSSTArrayTagged<T> {
  tag: typeof JSSTArrayTag;
  payload: (t?: T) => JSSTArray;
}
interface JSSTAllOfTagged<T> {
  tag: typeof JSSTAllOfTag;
  payload: (t?: T) => JSSTAllOf;
}
interface JSSTAnyOfTagged<T> {
  tag: typeof JSSTAnyOfTag;
  payload: (t?: T) => JSSTAnyOf;
}
interface JSSTOneOfTagged<T> {
  tag: typeof JSSTOneOfTag;
  payload: (t?: T) => JSSTOneOf;
}
interface JSSTNotTagged<T> {
  tag: typeof JSSTNotTag;
  payload: (t?: T) => JSSTNot;
}

interface JSSTObjectTagged<T> {
  tag: typeof JSSTObjectTag;
  payload: (t?: T) => JSSTObject;
}

type Everything<T> =
  | JSONValue
  | JSSTConstTagged
  | JSSTNullTagged
  | JSSTIntegerTagged
  | JSSTNumberTagged
  | JSSTStringTagged
  | JSSTRegexTagged
  | JSSTBooleanTagged
  | JSSTObjectTagged<T>
  | JSSTArrayTagged<T>
  | JSSTAllOfTagged<T>
  | JSSTAnyOfTagged<T>
  | JSSTOneOfTagged<T>
  | JSSTNotTagged<T>
  | NeedsTagged<T>
  | ExtendTagged<T>;

export const nul = (): JSSTNullTagged => ({
  tag: JSSTNullTag,
  payload: { type: "null" }
});
export const cnst = (c: JSONValue): JSSTConstTagged => ({
  tag: JSSTConstTag,
  payload: { const: c }
});
export const integer = (props?: IntProps): JSSTIntegerTagged => ({
  tag: JSSTIntegerTag,
  payload: { type: "integer", ...(props || {}) }
});
export const number = (props?: Partial<NumberProps>): JSSTNumberTagged => ({
  tag: JSSTNumberTag,
  payload: { type: "number", ...(props || {}) }
});
export const string = (): JSSTStringTagged => ({
  tag: JSSTStringTag,
  payload: { type: "string" }
});
export const stringEnum = (enu: string[]): JSSTStringEnumTagged => ({
  tag: JSSTStringEnumTag,
  payload: { type: "string", enum: enu }
});
export const numberEnum = (enu: number[]): JSSTNumberEnumTagged => ({
  tag: JSSTNumberEnumTag,
  payload: { type: "number", enum: enu }
});
export const integerEnum = (enu: number[]): JSSTIntegerEnumTagged => ({
  tag: JSSTIntegerEnumTag,
  payload: { type: "integer", enum: enu }
});
export const regex = (pattern: string): JSSTRegexTagged => ({
  tag: JSSTRegexTag,
  payload: { type: "string", pattern }
});
export const boolean = (): JSSTBooleanTagged => ({
  tag: JSSTBooleanTag,
  payload: { type: "boolean" }
});
export const array = <T>(items: Everything<T>): JSSTArrayTagged<T> => ({
  tag: JSSTArrayTag,
  payload: (t?: T) => ({ type: "array", items: poet(items, t) })
});
export const allOf = <T>(arr: Everything<T>[]): JSSTAllOfTagged<T> => ({
  tag: JSSTAllOfTag,
  payload: (t?: T) => ({ allOf: arr.map(i => poet(i, t)) })
});
export const anyOf = <T>(arr: Everything<T>[]): JSSTAnyOfTagged<T> => ({
  tag: JSSTAnyOfTag,
  payload: (t?: T) => ({ anyOf: arr.map(i => poet(i, t)) })
});
export const oneOf = <T>(arr: Everything<T>[]): JSSTOneOfTagged<T> => ({
  tag: JSSTOneOfTag,
  payload: (t?: T) => ({ oneOf: arr.map(i => poet(i, t)) })
});
export const not = <T>(n: Everything<T>): JSSTNotTagged<T> => ({
  tag: JSSTNotTag,
  payload: (t?: T) => ({ not: poet(n, t) })
});

export const dictionary = <T>(vals: Everything<T>): JSSTObjectTagged<T> =>
  object({ additionalProperties: vals });

export const type = <T>(
  req: EverythingRec<T>,
  opt: EverythingRec<T>
): JSSTObjectTagged<T> =>
  object({ properties: { ...req, ...opt }, required: Object.keys(req) });

export const object = <T>(
  props?: Partial<ObjectProps<T>>
): JSSTObjectTagged<T> => ({
  tag: JSSTObjectTag,
  payload: (t?: T) => ({
    type: "object",
    ...(props && props.required ? { required: props.required } : {}),
    ...(props && props.properties
      ? {
          properties: Object.entries(props.properties)
            .map(([a, b]) => ({ [a]: poet(b, t) }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        }
      : {}),
    ...(props && props.patternProperties
      ? {
          patternProperties: Object.entries(props.patternProperties)
            .map(([a, b]) => ({ [a]: poet(b, t) }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        }
      : {}),
    ...(props && props.additionalProperties
      ? {
          additionalProperties:
            typeof props.additionalProperties === "boolean"
              ? props.additionalProperties
              : poet(props.additionalProperties, t)
        }
      : {})
  })
});

const NeedsTag: unique symbol = Symbol();
interface NeedsTagged<T> {
  tag: typeof NeedsTag;
  payload: (t?: T) => Everything<T>;
}

export const needs = <T>(what: (t?: T) => Everything<T>): NeedsTagged<T> => ({
  tag: NeedsTag,
  payload: (t?: T) => what(t)
});

const ExtendTag: unique symbol = Symbol();
interface ExtendTagged<T> {
  tag: typeof ExtendTag;
  payload: (t?: T) => JSONSchemaObject;
}
export const extend = <T>(
  what: Everything<T>,
  key: string,
  v: JSONValue
): ExtendTagged<T> => ({
  tag: ExtendTag,
  payload: (t?: T) => <JSONSchemaObject>{ ...poet(what, t), [key]: v }
});

export const poet = <T>(input: Everything<T>, t?: T): JSONSchemaObject =>
  JSONValue.is(input)
    ? { const: input }
    : input.tag === NeedsTag
    ? poet(input.payload(t), t)
    : input.tag === JSSTObjectTag ||
      input.tag == JSSTArrayTag ||
      input.tag == ExtendTag ||
      input.tag == JSSTAllOfTag ||
      input.tag == JSSTAnyOfTag ||
      input.tag == JSSTOneOfTag ||
      input.tag == JSSTNotTag
    ? input.payload(t)
    : input.payload;
