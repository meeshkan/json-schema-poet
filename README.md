# json-schema-poet

Write JSON Schema like you'd write poetry. **json-shcema-poet** utilizes the library [json-schema-srictly-typed](https://github.com/unmock/json-schema-strictly-typed.git) which allows to create types from predefined apis.

## Example

```
import {nul, cnst} from 'json-shecma-poet';

test("null yields null schema", () => {
  expect(jsp.nul()).toEqual({ type: "null" });
});

```

#API
The list of API are as follow:

- nul()
- cnst()
- integer()
- number()
- string()
- and others
