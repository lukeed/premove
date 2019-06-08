const fs = require('fs');
const test = require('tape');
const mkdirs = require('mk-dirs');
const { promisify } = require('util');
const premove = require('../dist/premove');
const { dirname, resolve } = require('path');

const write = promisify(fs.writeFile);

function touch(str) {
	let dir = dirname(str = resolve(str));
	return mkdirs(dir).then(() => write(str, 'hello')).then(() => str);
}

test.Test.prototype.exists = function (str, bool, msg) {
	msg = msg || (bool ? '~> (setup) exists' : '~> does not exist');
	this.is(fs.existsSync(str), bool, msg);
};

test('exports', t => {
	t.is(typeof premove, 'function', 'a function');
	t.end();
});

test('remove single file', async t => {
	let foo = await touch('./foo.txt');
	let bar = await touch('./bar.txt');

	t.exists(foo, true);
	t.exists(bar, true);

	let out = await premove(foo);
	t.is(out, undefined, '~> returns no output');

	t.exists(foo, false, '~> (foo) removed');
	t.exists(bar, true, '~> (bar) exists');

	await premove(bar); // cleanup
	t.exists(bar, false, '~> (bar) removed');

	t.end();
});

test('remove single directory', async t => {
	let str = resolve('./foo');
	await mkdirs(str);

	t.exists(str, true);

	await premove(str);
	t.exists(str, false, '~> removed dir');

	t.end();
});

test('remove file, leave directory', async t => {
	let foo = await touch('./bar/foo.txt');
	let bar = dirname(foo);
	t.exists(foo, true);

	await premove(foo);
	t.exists(foo, false, '~> (foo) file removed');
	t.exists(bar, true, '~> (bar) dir exists');

	await premove(bar); // cleanup
	t.exists(bar, false, '~> (bar) removed');

	t.end();
});

test('remove directory and its contents', async t => {
	let file = await touch('./foo/bar.txt');
	let dir = dirname(file);

	t.exists(dir, true, '(setup) dir exists');
	t.exists(file, true, '(setup) file exists');

	await premove(dir);
	t.exists(dir, false, '~> (dir) removed');
	t.exists(file, false, '~> (file) removed');

	t.end();
});

test('remove directory, leave parent', async t => {
	let file = await touch('./foo/bar/baz/bat/hello.txt');
	let baz = resolve('./foo/bar/baz');
	let dir = dirname(file);

	t.exists(dir, true, '(setup) dir exists');
	t.exists(file, true, '(setup) file exists');
	t.exists(baz, true, '(setup) "baz" exists');

	await premove(dir);
	t.exists(dir, false, '~> (dir) removed');
	t.exists(file, false, '~> (file) removed');
	t.exists(baz, true, '~> (baz) still exists');

	let foo = resolve('./foo');
	await premove(foo);
	t.exists(foo, false, '~> cleanup');

	t.end();
});

test('remove directory recursively', async t => {
	let f1 = await touch('./foo/bar/baz/bat/hello.txt');
	let f2 = await touch('./foo/bar/baz/bat/world.txt');
	let f3 = await touch('./foo/bar/baz/hello.txt');
	let f4 = await touch('./foo/hello.txt');

	let dir = resolve('./foo');

	t.exists(dir, true, '(setup) dir exists');
	t.exists(f1, true, '(setup) f1 exists');
	t.exists(f2, true, '(setup) f2 exists');
	t.exists(f3, true, '(setup) f3 exists');
	t.exists(f4, true, '(setup) f4 exists');

	await premove(dir);

	t.exists(dir, false, '~> (dir) removed');
	t.exists(f1, false, '~> (f1) removed');
	t.exists(f2, false, '~> (f2) removed');
	t.exists(f3, false, '~> (f3) removed');
	t.exists(f4, false, '~> (f4) removed');

	t.end();
});
