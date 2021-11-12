# pointer-props

JavaScript object manipulation (get/set/del) using JSON Pointer (RFC6901) syntax, and optional resolution of [JSON References](https://datatracker.ietf.org/doc/html/draft-pbryan-zyp-json-ref-03).

## Install

The usual ways:

```shell
npm install pointer-props
```

## Example

Get or set a property, either using the JSON Pointer string or with an array:

```js
import { get, set } from 'pointer-props'
const obj = { foo: { bar: 3 } }
get(obj, '/foo/bar') // => 3
get(obj, [ 'foo', 'bar' ]) // => 3
set(obj, '/foo/bar', 4) // => { foo: { bar: 4 } }
set(obj, [ 'foo', 'bar' ], 5) // => { foo: { bar: 5 } }
```

Resolve JSON Reference paths to the final non-referenced path (as an array):

```js
import { resolve } from 'pointer-props'
const obj = {
	foo: { $ref: '#/fizz/buzz' },
	fizz: { buzz: 3 }
}
resolve('#/foo/bar') // => [ 'fizz', 'buzz' ]
```

Handles escaped strings, as expected:

```js
const obj = {
	'f/o/o': {
		'b~a~r': 3
	}
}
get(obj, '/f~1o~1o/b~0a~0r') // => 3
```

Generate escaped strings from a list of tokens, or a list of tokens from a string:

```js
import { toPointer, toTokens } from 'pointer-props'
toPointer([ 'a/b', 'c~d' ]) // => "/a~1b/c~0d"
toTokens('/a~1b/c~0d') // => [ "a/b", "c~d" ]
```

## API

Under the hood, the get/set functions use the amazing [`dset`](https://github.com/lukeed/dset) and [`dlv`](https://github.com/developit/dlv),
which should be pretty familiar.

### `function get(obj: any, path: string | ArrayLike<string | number>): any`

Get a property using either a JSON Pointer string, or an array of already-unescaped accessor tokens.

```js
import { get } from 'pointer-props'
const obj = { foo: { bar: 3 } }
get(obj, '/foo/bar') // => 3
get(obj, [ 'foo', 'bar' ]) // => 3
```

### `function set<T extends object, V>(obj: T, path: string | ArrayLike<string | number>, value: V): T`

Set a property using either a JSON Pointer string, or an array of already-unescaped accessor tokens.

For convenience, the modified object is also returned.

```js
import { set } from 'pointer-props'
const obj = {}
set(obj, '/foo/bar', 3)
console.log(obj.foo.bar) // => 3
set(obj, [ 'foo', 'bar' ], 4)
console.log(obj.foo.bar) // => 4
```

### `function del<T extends object>(obj: T, path: string | ArrayLike<string | number>): T`

Remove a property using either a JSON Pointer string, or an array of already-unescaped accessor tokens.

For convenience, the modified object is also returned.

```js
import { set } from 'pointer-props'
const obj = {}
set(obj, '/foo/bar', 3)
console.log(obj.foo.bar) // => 3
set(obj, [ 'foo', 'bar' ], 4)
console.log(obj.foo.bar) // => 4
```

### `function toTokens(path: string): Array<string>`

Convert a JSON Pointer string to a list of unescaped accessor tokens.

```js
import { toTokens } from 'pointer-props'
toTokens('/a~1b/c~0d') // => [ "a/b", "c~d" ]
```

### `function toPointer(list: ArrayLike<string | number>): string`

Convert a list of unescaped accessor tokens into a JSON Pointer string.

```js
import { toPointer } from 'pointer-props'
toPointer([ 'a/b', 'c~d' ]) // => "/a~1b/c~0d"
```

### `export function resolve<T extends object>(obj: T, path: string | ArrayLike<string | number>): ArrayLike<string | number>`

Given a JSON Pointer string and an object potentially containing [JSON References](https://datatracker.ietf.org/doc/html/draft-pbryan-zyp-json-ref-03) (e.g. `$ref`), resolve all references and return the final path.

```js
import { resolve } from 'pointer-props'
const obj = {
	foo: { $ref: '#/bar' },
	bar: { $ref: '#/fizz' },
	fizz: { $ref: '#/buzz' },
	buzz: 3
}
resolve('#/foo') // => [ 'buzz' ]
```

## License

Published and released under the [Very Open License](http://veryopenlicense.com).

If you need a commercial license, [contact me here](https://davistobias.com/license?software=pointer-props).
