import * as jsp from "../src";
const { poet } = jsp;

test("number yields number schema", () => {
  expect(poet(jsp.number())).toEqual({ type: "number" });
});

test("null yields null schema", () => {
  expect(poet(jsp.nul())).toEqual({ type: "null" });
});

test("const yields null schema", () => {
  expect(poet(jsp.cnst({ foo: 1 }))).toEqual({ const: { foo: 1 } });
});
test("integer yields number schema", () => {
  expect(poet(jsp.integer())).toEqual({ type: "integer" });
});

test("string yields string schema", () => {
  expect(poet(jsp.string())).toEqual({ type: "string" });
});

test("boolean yields boolean schema", () => {
  expect(poet(jsp.boolean())).toEqual({ type: "boolean" });
});

test("array yields array schema", () => {
  expect(poet(jsp.array(jsp.string()))).toEqual({
    type: "array",
    items: { type: "string" }
  });
});

test("array yields array schema with const", () => {
  expect(poet(jsp.array("foo"))).toEqual({
    type: "array",
    items: { const: "foo" }
  });
});

test("dictionary yields object with only additionalProperties", () => {
  expect(poet(jsp.dictionary(jsp.number()))).toEqual({
    type: "object",
    additionalProperties: { type: "number" }
  });
});

test("object yields const schema", () => {
  expect(
    poet(
      jsp.object({
        properties: {
          foo: jsp.string(),
          bar: jsp.number(),
          baz: 55
        }
      })
    )
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
    poet(
      jsp.type(
        {
          foo: jsp.string(),
          bar: jsp.number()
        },
        {
          baz: jsp.string()
        }
      )
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

test("object can get stuff from store", () => {
  expect(
    poet(
      jsp.object({
        properties: {
          foo: jsp.string(),
          bar: jsp.number(),
          baz: jsp.needs(() => 55)
        }
      })
    )
  ).toEqual({
    type: "object",
    properties: {
      foo: { type: "string" },
      bar: { type: "number" },
      baz: { const: 55 }
    }
  });
});

test("object can get stuff from store with type", () => {
  expect(
    poet(
      jsp.object({
        properties: {
          foo: jsp.string(),
          bar: jsp.number(),
          baz: jsp.needs((s?: string) => (s ? s.toUpperCase() : "BAR"))
        }
      }),
      "foo"
    )
  ).toEqual({
    type: "object",
    properties: {
      foo: { type: "string" },
      bar: { type: "number" },
      baz: { const: "FOO" }
    }
  });
});

test("object can be extended", () => {
  expect(
    poet(
      jsp.object({
        properties: {
          foo: jsp.string(),
          bar: jsp.number(),
          baz: jsp.extend(jsp.number(), "x-do-thing", 55)
        }
      })
    )
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
  expect(poet(jsp.allOf([jsp.string(), jsp.number()]))).toEqual({
    allOf: [{ type: "string" }, { type: "number" }]
  });
});

test("anyOf yields correct schema", () => {
  expect(poet(jsp.anyOf([jsp.string(), jsp.number()]))).toEqual({
    anyOf: [{ type: "string" }, { type: "number" }]
  });
});

test("oneOf yields correct schema", () => {
  expect(poet(jsp.oneOf([jsp.string(), jsp.number()]))).toEqual({
    oneOf: [{ type: "string" }, { type: "number" }]
  });
});

test("not yields correct schema", () => {
  expect(poet(jsp.not(jsp.string()))).toEqual({
    not: { type: "string" }
  });
});
