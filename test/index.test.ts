import * as jsp from "../src";

test("number yields number schema", () => {
  expect(jsp.number()).toEqual({ type: "number" });
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

// This is purely random request
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

test("object can be extended", () => {
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
