# premove [![CI](https://github.com/lukeed/premove/workflows/CI/badge.svg)](https://github.com/lukeed/premove/actions) [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/premove)](https://codecov.io/gh/lukeed/premove)

> A tiny (201B to 247B) utility to remove items recursively

This is a `Promise`-based utility that recursively removes files and directories. It's effectively `rm -rf` for Node.js.

## Install

```
$ npm install --save premove
```


## Modes

There are two "versions" of `premove` available:

#### "async"
> **Node.js:** >= 8.x<br>
> **Size (gzip):** 247 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/premove/dist/index.js), [ES Module](https://unpkg.com/premove/dist/index.mjs)

This is the primary/default mode. It makes use of `async`/`await` and [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original).

#### "sync"
> **Node.js:** >= 6.x<br>
> **Size (gzip):** 201 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/premove/sync/index.js), [ES Module](https://unpkg.com/premove/sync/index.mjs)

This is the opt-in mode, ideal for scenarios where `async` usage cannot be supported.<br>In order to use it, simply make the following changes:

```diff
-import premove from 'premove';
+import premove from 'premove/sync';
```

## Usage

```js
import premove from 'premove';
import { resolve } from 'path';

// Async/await
try {
  await premove('./foobar');
} catch (err) {
  //
}

// Promise
premove('./foobar').then(val => {
  console.log(val); //=> undefined
}).catch(err => {
  //
});

// Using `cwd` option
const dir = resolve('./foo/bar');
await premove('hello.txt', { cwd: dir });
```


## API

### premove(str, opts={})
Returns: `Promise<undefined>` or `false`

Returns a Promise that resolves to `undefined` once complete.<br>
Returns `false` immediately if the initial filepath (`str`) does not exist.

> **Important:**<br>The `sync` and `async` versions share the same API.<br>The **only** difference is that `sync` is not Promise-based.

#### str
Type: `String`

The filepath to remove – may be a file or a directory.<br>
An initial existence check is made for this filepath.

> **Important:** This [value is resolved](https://nodejs.org/api/path.html#path_path_resolve_paths) to a full path.<br>
Please be aware of how and _from where_ the Node.js file system is resolving your path!

#### options.cwd
Type: `String`<br>
Default: `.`

The directory to resolve your `str` from.<br>
Defaults to the `process.cwd()` – aka, the directory that your command is run within.


## Related

- [totalist](https://github.com/lukeed/totalist) - A tiny (195B to 224B) utility to recursively list all (total) files in a directory
- [mk-dirs](https://github.com/lukeed/mk-dirs) - A tiny (420B) utility to make a directory and its parents, recursively
- [escalade](https://github.com/lukeed/escalade) - A tiny (183B) and fast utility to ascend parent directories


## License

MIT © [Luke Edwards](https://lukeed.com)
