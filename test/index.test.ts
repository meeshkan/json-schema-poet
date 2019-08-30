import * as poet from "../src";

test("number yields number schema", () => {
  expect(poet.poet(poet.number())).toEqual({ type: "number" });
});

test("integer yields number schema", () => {
  expect(poet.poet(poet.integer())).toEqual({ type: "integer" });
});

test("string yields string schema", () => {
  expect(poet.poet(poet.string())).toEqual({ type: "string" });
});

test("boolean yields boolean schema", () => {
  expect(poet.poet(poet.boolean())).toEqual({ type: "boolean" });
});

test("array yields array schema", () => {
  expect(poet.poet(poet.array(poet.string()))).toEqual({
    type: "array",
    items: { type: "string" }
  });
});

test("array yields array schema with const", () => {
  expect(poet.poet(poet.array("foo"))).toEqual({
    type: "array",
    items: { const: "foo" }
  });
});

test("object yields const schema", () => {
  expect(
    poet.poet(
      poet.object({
        properties: {
          foo: poet.string(),
          bar: poet.number(),
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
