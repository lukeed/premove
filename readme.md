# premove [![CI](https://github.com/lukeed/premove/workflows/CI/badge.svg)](https://github.com/lukeed/premove/actions) [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/premove)](https://codecov.io/gh/lukeed/premove)

> A tiny (208B to 260B) utility to remove items recursively

This is a `Promise`-based, cross-platform utility that recursively removes files and directories. It's effectively a programmatic `rm -rf` for Node.js. There's also a [CLI](#cli) for easy, cross-platform usage.

> **Notice:** Node v12.10.0 includes the `recursive` option for [`fs.rmdir`](https://nodejs.org/api/fs.html#fs_fs_rmdir_path_options_callback) and [`fs.rmdirSync`](https://nodejs.org/api/fs.html#fs_fs_rmdirsync_path_options).

## Install

```
$ npm install --save premove
```


## Modes

There are two "versions" of `premove` available:

#### "async"
> **Node.js:** >= 8.x<br>
> **Size (gzip):** 249 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/premove/dist/index.js), [ES Module](https://unpkg.com/premove/dist/index.mjs)

This is the primary/default mode. It makes use of `async`/`await` and [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original).

#### "sync"
> **Node.js:** >= 6.x<br>
> **Size (gzip):** 202 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/premove/sync/index.js), [ES Module](https://unpkg.com/premove/sync/index.mjs)

This is the opt-in mode, ideal for scenarios where `async` usage cannot be supported.<br>In order to use it, simply make the following changes:

```diff
-import { premove } from 'premove';
+import { premove } from 'premove/sync';
```

## Usage

```js
import { resolve } from 'path';
import { premove } from 'premove';

// Async/await
try {
  await premove('./foobar');
} catch (err) {
  //
}

// Promise
premove('./foobar').then(val => {
  console.log(typeof val);
  //=> boolean
}).catch(err => {
  //
});

// Using `cwd` option
const dir = resolve('./foo/bar');
await premove('hello.txt', { cwd: dir });
```

## CLI

A `premove` binary is available as of v3.0.0. <br>It accepts an optional `--cwd` value and a list of paths to delete.

> **Important:** By default `premove` refuses to delete:
> * the [`os.homedir`](https://nodejs.org/api/os.html#os_os_homedir)
> * the system root (`/`, `C:\\`, etc)
> * items not contained by `--cwd` path

```sh
# remove "foo" and "bar" via `npx`
$ npx premove foo bar

# install globally, use whenever
$ npm install premove -g
$ premove foo bar
```

## API

### premove(str, opts={})
Returns: `Promise<boolean>`

Returns a Promise that resolves with a boolean value. <br>If `true`, indicates that the `str` input _did exist_ and was successfully removed. A `false` value indicates that the `str` input _did not exist_, meaning nothing needed to be removed.

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
- [mk-dirs](https://github.com/lukeed/mk-dirs) - A tiny (381B to 419B) utility to make a directory and its parents, recursively
- [escalade](https://github.com/lukeed/escalade) - A tiny (183B) and fast utility to ascend parent directories


## License

MIT © [Luke Edwards](https://lukeed.com)
