import {
  JSSTInteger,
  JSSTNumber,
  JSSTString,
  JSSTRegex,
  JSSTBoolean,
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
  JSSTNumberEnum,
  JSSTAnything,
  JSONValue,
  JSSTTuple,
  JSSTList
} from "json-schema-strictly-typed";
import * as io from "io-ts";

interface IntPropsWithMinimum {
  minimum: number;
  exclusiveMinimum?: boolean;
  multipleOf?: number;
}

interface IntPropsWithMaximum {
  maximum: number;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
}

interface IntPropsWithBounds {
  minimum: number;
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
  minimum: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum: number;
  multipleOf?: number;
}

interface IntPropsWithExclusiveBounds {
  minimum: number;
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
  minimum: number;
  maximum: number;
}

interface ObjectProps<T, U extends object> {
  properties: Record<string, JSSTAnything<T, U>>;
  additionalProperties: boolean | JSSTAnything<T, U>;
  patternProperties: Record<string, JSSTAnything<T, U>>;
  required: string[];
}
export const nul_ = <U extends object>(u: U) => (): JSSTNull<U> => ({
  type: "null",
  ...u
});
export const nul = nul_({});
export const cnst_ = <U extends object>(u: U) => (
  c: JSONValue
): JSSTConst<U> => ({
  const: c,
  ...u
});
export const cnst = cnst_({});
export const integer_ = <U extends object>(u: U) => (
  props?: IntProps
): JSSTInteger<U> => ({
  type: "integer",
  ...(props || {}),
  ...u
});
export const integer = integer_({});
export const number_ = <U extends object>(u: U) => (
  props?: Partial<NumberProps>
): JSSTNumber<U> => ({
  type: "number",
  ...(props || {}),
  ...u
});
export const number = number_({});
export const string_ = <U extends object>(u: U) => (): JSSTString<U> => ({
  type: "string",
  ...u
});
export const string = string_({});
export const stringEnum_ = <U extends object>(u: U) => (
  enu: string[]
): JSSTStringEnum<U> => ({
  type: "string",
  enum: enu,
  ...u
});
export const stringEnum = stringEnum_({});
export const numberEnum_ = <U extends object>(u: U) => (
  enu: number[]
): JSSTNumberEnum<U> => ({
  type: "number",
  enum: enu,
  ...u
});
export const numberEnum = numberEnum_({});
export const integerEnum_ = <U extends object>(u: U) => (
  enu: number[]
): JSSTIntegerEnum<U> => ({
  type: "integer",
  enum: enu,
  ...u
});
export const integerEnum = integerEnum_({});
export const regex_ = <U extends object>(u: U) => (
  pattern: string
): JSSTRegex<U> => ({
  type: "string",
  pattern,
  ...u
});
export const regex = regex_({});
export const boolean_ = <U extends object>(u: U) => (): JSSTBoolean<U> => ({
  type: "boolean",
  ...u
});
export const boolean = boolean_({});
export const array_ = <T, U extends object>(u: U) => (
  items: JSSTAnything<T, U>
): JSSTList<T, U> => ({
  type: "array",
  items,
  ...u
});
export const array = <T>(items: JSSTAnything<T, {}>) => array_({})(items);
export const tuple_ = <T, U extends object>(u: U) => (
  items: JSSTAnything<T, U>[]
): JSSTTuple<T, U> => ({
  type: "array",
  items,
  ...u
});
export const tuple = <T>(items: JSSTAnything<T, {}>[]) => tuple_({})(items);
export const allOf_ = <T, U extends object>(u: U) => (
  allOf: JSSTAnything<T, U>[]
): JSSTAllOf<T, U> => ({
  allOf,
  ...u
});
export const allOf = <T>(allOf: JSSTAnything<T, {}>[]) => allOf_({})(allOf);

export const anyOf_ = <T, U extends object>(u: U) => (
  anyOf: JSSTAnything<T, U>[]
): JSSTAnyOf<T, U> => ({
  anyOf,
  ...u
});
export const anyOf = <T>(anyOf: JSSTAnything<T, {}>[]) => anyOf_({})(anyOf);
export const oneOf_ = <T, U extends object>(u: U) => (
  oneOf: JSSTAnything<T, U>[]
): JSSTOneOf<T, U> => ({
  oneOf,
  ...u
});
export const oneOf = <T>(oneOf: JSSTAnything<T, {}>[]) => oneOf_({})(oneOf);
export const not_ = <T, U extends object>(u: U) => (
  not: JSSTAnything<T, U>
): JSSTNot<T, U> => ({ not, ...u });
export const not = <T>(not: JSSTAnything<T, {}>) => not_({})(not);
export const dictionary_ = <T, U extends object>(u: U) => (
  vals: JSSTAnything<T, U>
): JSSTObject<T, U> => object_<T, U>(u)({ additionalProperties: vals });
export const dictionary = <T>(vals: JSSTAnything<T, {}>) =>
  dictionary_({})(vals);
export const type_ = <T, U extends object>(u: U) => (
  req: Record<string, JSSTAnything<T, U>>,
  opt: Record<string, JSSTAnything<T, U>>
): JSSTObject<T, U> =>
  object_<T, U>(u)({
    properties: { ...req, ...opt },
    required: Object.keys(req)
  });
export const type = <T>(
  req: Record<string, JSSTAnything<T, {}>>,
  opt: Record<string, JSSTAnything<T, {}>>
) => type_({})(req, opt);

export const object_ = <T, U extends object>(u: U) => (
  props?: Partial<ObjectProps<T, U>>
): JSSTObject<T, U> => ({
  type: "object",
  ...(props && props.required ? { required: props.required } : {}),
  ...(props && props.properties
    ? {
        properties: Object.entries(props.properties)
          .map(([a, b]) => ({ [a]: b }))
          .reduce((a, b) => ({ ...a, ...b }), {})
      }
    : {}),
  ...(props && props.patternProperties
    ? {
        patternProperties: Object.entries(props.patternProperties)
          .map(([a, b]) => ({ [a]: b }))
          .reduce((a, b) => ({ ...a, ...b }), {})
      }
    : {}),
  ...(props && props.additionalProperties
    ? {
        additionalProperties:
          typeof props.additionalProperties === "boolean"
            ? props.additionalProperties
            : props.additionalProperties
      }
    : {}),
  ...u
});
export const object = <T>(props?: Partial<ObjectProps<T, {}>>) =>
  object_({})(props);
export const extend = <T, U extends object>(
  what: JSSTAnything<T, U>,
  key: string,
  v: JSONValue
): JSONSchemaObject<T, U> => <JSONSchemaObject<T, U>>{ ...what, [key]: v };

export const extendT = <T, U extends object>(u: U) => ({
  nul: nul_(u),
  cnst: cnst_(u),
  integer: integer_(u),
  number: number_(u),
  string: string_(u),
  stringEnum: stringEnum_(u),
  numberEnum: numberEnum_(u),
  integerEnum: integerEnum_(u),
  regex: regex_(u),
  boolean: boolean_(u),
  array: array_<T, U>(u),
  tuple: tuple_<T, U>(u),
  allOf: allOf_<T, U>(u),
  anyOf: anyOf_<T, U>(u),
  oneOf: oneOf_<T, U>(u),
  not: not_<T, U>(u),
  dictionary: dictionary_<T, U>(u),
  type: type_<T, U>(u),
  object: object_<T, U>(u),
  extend: (what: JSSTAnything<T, U>, key: string, v: JSONValue) =>
    extend(what, key, v)
});
