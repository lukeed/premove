# premove [![Build Status](https://badgen.now.sh/travis/lukeed/premove)](https://travis-ci.org/lukeed/premove)

> A tiny (247B) utility to remove items recursively

This is a `Promise`-based utility that recursively removes files and directories.<br>
It's effectively `rm -rf` for Node.js

Available in these formats:

* **ES Module**: `dist/premove.mjs`
* **CommonJS**: `dist/premove.js`

> **Important:** Requires Node 8.x or later – uses `async` functions.


## Install

```
$ npm install --save premove
```


## Usage

```js
import { resolve } from 'path';
import premove from 'premove';

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

- [`mk-dirs`](https://github.com/lukeed/mk-dirs) – Create directories recursively
- [`del`](https://www.npmjs.com/package/del) - Delete files and folders using globs


## License

MIT © [Luke Edwards](https://lukeed.com)
