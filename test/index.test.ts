import * as jsp from "../src";
import * as t from "io-ts";
test("number yields number schema", () => {
  expect(jsp.number()).toEqual({ type: "number" });
});

test("number enum yields numberEnum schema", () => {
  expect(jsp.numberEnum([1, 2, 3])).toEqual({
    type: "number",
    enum: [1, 2, 3]
  });
});

test("extendT works", () => {
  expect(jsp.extendT({ hello: "world" }).integer()).toEqual({
    type: "integer",
    hello: "world"
  });
});

test("top yields top level", () => {
  expect(jsp.top(jsp.number(), { $id: "foo" })).toEqual({
    $id: "foo",
    type: "number"
  });
});

test("$ref yields a reference", () => {
  expect(jsp.$ref("#/definitions/foo")).toEqual({
    $ref: "#/definitions/foo"
  });
});

test("null yields null schema", () => {
  expect(jsp.nul()).toEqual({ type: "null" });
});

test("const yields null schema", () => {
  expect(jsp.cnst({ foo: 1 })).toEqual({ const: { foo: 1 } });
});
test("integer yields number schema", () => {
  expect(jsp.integer()).toEqual({ type: "integer" });
});

test("string yields string schema", () => {
  expect(jsp.string()).toEqual({ type: "string" });
});

test("string with faker yields string schema", () => {
  expect(jsp.string("name.findName")).toEqual({
    type: "string",
    faker: "name.findName"
  });
});

test("boolean yields boolean schema", () => {
  expect(jsp.boolean()).toEqual({ type: "boolean" });
});

test("array yields array schema", () => {
  expect(jsp.array(jsp.string())).toEqual({
    type: "array",
    items: { type: "string" }
  });
});

test("array yields array schema with const", () => {
  expect(jsp.array(jsp.cnst("foo"))).toEqual({
    type: "array",
    items: { const: "foo" }
  });
});

test("dictionary yields object with only additionalProperties", () => {
  expect(jsp.dictionary(jsp.number())).toEqual({
    type: "object",
    additionalProperties: { type: "number" }
  });
});

test("object yields const schema", () => {
  expect(
    jsp.object({
      properties: {
        foo: jsp.string(),
        bar: jsp.number(),
        baz: jsp.cnst(55)
      }
    })
  ).toEqual({
    type: "object",
    properties: {
      foo: { type: "string" },
      bar: { type: "number" },
      baz: { const: 55 }
    }
  });
});

test("type yields correct schema", () => {
  expect(
    jsp.type(
      {
        foo: jsp.string(),
        bar: jsp.number()
      },
      {
        baz: jsp.string()
      }
    )
  ).toEqual({
    type: "object",
    properties: {
      foo: { type: "string" },
      bar: { type: "number" },
      baz: { type: "string" }
    },
    required: ["foo", "bar"]
  });
});

test("object type can be extended", () => {
  const d = new Date();
  expect(
    jsp.object<Date>({
      properties: {
        foo: jsp.string(),
        bar: jsp.number(),
        baz: d
      }
    })
  ).toEqual({
    type: "object",
    properties: {
      foo: { type: "string" },
      bar: { type: "number" },
      baz: d
    }
  });
});

const Unmock: unique symbol = Symbol();
type Unmock = {
  unmock?: typeof Unmock;
};
test("object type and base can be extended", () => {
  const d = new Date();
  const umk: Unmock = { unmock: Unmock };
  expect(
    jsp.object_<Date, Unmock>(umk)({
      properties: {
        foo: jsp.string_<Unmock>({})(),
        bar: jsp.number_<Unmock>(umk)(),
        baz: d
      }
    })
  ).toEqual({
    type: "object",
    properties: {
      foo: { type: "string" },
      bar: { type: "number", unmock: Unmock },
      baz: d
    },
    unmock: Unmock
  });
});

test("object can be extended", () => {
  expect(
    jsp.object({
      properties: {
        foo: jsp.string(),
        bar: jsp.number(),
        baz: jsp.extend(jsp.number(), "x-do-thing", 55)
      }
    })
  ).toEqual({
    type: "object",
    properties: {
      foo: { type: "string" },
      bar: { type: "number" },
      baz: { type: "number", ["x-do-thing"]: 55 }
    }
  });
});

test("allOf yields correct schema", () => {
  expect(jsp.allOf([jsp.string(), jsp.number()])).toEqual({
    allOf: [{ type: "string" }, { type: "number" }]
  });
});

test("anyOf yields correct schema", () => {
  expect(jsp.anyOf([jsp.string(), jsp.number()])).toEqual({
    anyOf: [{ type: "string" }, { type: "number" }]
  });
});

test("oneOf yields correct schema", () => {
  expect(jsp.oneOf([jsp.string(), jsp.number()])).toEqual({
    oneOf: [{ type: "string" }, { type: "number" }]
  });
});

test("not yields correct schema", () => {
  expect(jsp.not(jsp.string())).toEqual({
    not: { type: "string" }
  });
});
