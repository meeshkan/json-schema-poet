import * as jsp from "../src";
const { poet } = jsp;

test("number yields number schema", () => {
  expect(poet(jsp.number())).toEqual({ type: "number" });
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
