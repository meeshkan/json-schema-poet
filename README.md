# json-schema-poet

[JSON Schema](https://json-schema.org) is a useful way to define input and output schemas.

Typescript is a useful way to verify the types of JavaScript objects.

`json-schema-poet` simplifies implementations of variable types by shortening down and simplifying code. It also provide JSON Schema to strictly specify correct types. 

## Example

```typescript
import * as jsp from "json-schema-poet";

const myInt = jsp.integer(); // produces { type: "integer" }
```

## API

Assuming that you import a top-level object called `jsp` as done above, here are all of the types in the API.

 `jsp.integer()`
 `jsp.number()`
 `jsp.string()`
 `jsp.cnst()` 
 `jsp.boolean()`
 `jsp.array()`
 `jsp.dictionary()`
 `jsp.object()`


## Todo

There is plenty of stuff that is not implemented yet.  I'd really appreciate your help!

* add various tests
* expand poetry functionality  
