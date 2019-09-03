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
  JSSTNumberEnum,
  JSSTAnything,
  JSONValue
} from "json-schema-strictly-typed";
import * as io from "io-ts";

type Everything<T> = JSSTAnything<T>;

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
export const nul = (): JSSTNull => ({ type: "null" });
export const cnst = (c: JSONValue): JSSTConst => ({ const: c });
export const integer = (props?: IntProps): JSSTInteger => ({
  type: "integer",
  ...(props || {})
});
export const number = (props?: Partial<NumberProps>): JSSTNumber => ({
  type: "number",
  ...(props || {})
});
export const string = (): JSSTString => ({
  type: "string"
});
export const stringEnum = (enu: string[]): JSSTStringEnum => ({
  type: "string",
  enum: enu
});
export const numberEnum = (enu: number[]): JSSTNumberEnum => ({
  type: "number",
  enum: enu
});
export const integerEnum = (enu: number[]): JSSTIntegerEnum => ({
  type: "integer",
  enum: enu
});
export const regex = (pattern: string): JSSTRegex => ({
  type: "string",
  pattern
});
export const boolean = (): JSSTBoolean => ({
  type: "boolean"
});
export const array = <T>(items: Everything<T>): JSSTArray<T> => ({
  type: "array",
  items
});
export const tuple = <T>(items: Everything<T>[]): JSSTArray<T> => ({
  type: "array",
  items
});

export const allOf = <T>(allOf: Everything<T>[]): JSSTAllOf<T> => ({
  allOf
});
export const anyOf = <T>(anyOf: Everything<T>[]): JSSTAnyOf<T> => ({
  anyOf
});
export const oneOf = <T>(oneOf: Everything<T>[]): JSSTOneOf<T> => ({
  oneOf
});
export const not = <T>(not: Everything<T>): JSSTNot<T> => ({ not });

export const dictionary = <T>(vals: Everything<T>): JSSTObject<T> =>
  object({ additionalProperties: vals });

export const type = <T>(
  req: EverythingRec<T>,
  opt: EverythingRec<T>
): JSSTObject<T> =>
  object({ properties: { ...req, ...opt }, required: Object.keys(req) });

export const object = <T>(props?: Partial<ObjectProps<T>>): JSSTObject<T> => ({
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
          .map(([a, b]) => ({ [a]:b }))
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
    : {})
});

export const extend = <T>(
  what: Everything<T>,
  key: string,
  v: JSONValue
): JSONSchemaObject<T> => <JSONSchemaObject<T>>{ ...what, [key]: v };
