# json-schema-poet

[JSON Schema](https://json-schema.org) is a useful way to define input and output schemas.

Typescript is a useful way to verify the types of JavaScript objects.

`json-schema-strictly-poet` Write JSON Schema like you'd write poetry.

## Installation

[JSON Schema](https://json-schema.org) can be installed as a package from ***npm registry***.

```
  npm install --save json-schema-poet
```

## Example

```typescript
import * as jsp from "json-schema-poet";

test("integer yields number schema", () => {
  expect(jsp.integer()).toEqual({ type: "integer" });
});
```

## API

Here are all of the functions in the API.

* `nul()`
* `cnst()`
* `integer()`
* `number()`
* `string()`
* `stringEnum()`
* `numberEnum()`
* `integerEnum()`
* `regex()`
* `boolean()`
* `array()`
* `tuple()`
* `allOf()`
* `anyOf()`
* `oneOf()`
* `not()`
* `dictionary()`
* `type()`
* `object()`
* `extend()`

## Contributing

Thanks for wanting to contribute! We will soon have a contributing page detaling how to contribute. Meanwhile, feel free to star this repository, [open issues](https://github.com/unmock/json-schema-poet/issues) and ask for more features and support.

Please note that this project is governed by the [Unmock Community Code of Conduct](https://github.com/unmock/code-of-conduct). By participating in this project, you agree to abide by its terms.
