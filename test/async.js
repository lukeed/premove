import { test } from 'uvu';
import { mkdir } from 'mk-dirs';
import { promisify } from 'util';
import * as assert from 'uvu/assert';
import { dirname, resolve } from 'path';
import { existsSync, writeFile } from 'fs';
import { premove } from '../src/async';

const write = promisify(writeFile);

async function touch(str) {
	let dir = dirname(str = resolve(str));
	await mkdir(dir).then(() => write(str, 'hello'));
	return str;
}

function exists(str, bool, msg) {
	assert.is(existsSync(str), bool, msg);
}

test('exports', () => {
	assert.type(premove, 'function');
});

test('remove single file', async () => {
	let foo = await touch('./foo.txt');
	let bar = await touch('./bar.txt');

	exists(foo, true);
	exists(bar, true);

	let out = await premove(foo);
	assert.type(out, 'boolean', '~> returns boolean');
	assert.is(out, true, '~> returns `true` because exists');

	exists(foo, false, '~> (foo) removed');
	exists(bar, true, '~> (bar) exists');

	await premove(bar); // cleanup
	exists(bar, false, '~> (bar) removed');
});

test('remove single directory', async () => {
	let str = resolve('./foo');
	await mkdir(str);
	exists(str, true);

	let output = await premove(str);
	assert.is(output, true, '~> existed');
	exists(str, false, '~> removed dir');
});

test('remove file, leave directory', async () => {
	let foo = await touch('./bar/foo.txt');
	let bar = dirname(foo);
	exists(foo, true);

	let output = await premove(foo);
	assert.is(output, true, '~> (foo) existed');
	exists(foo, false, '~> (foo) file removed');
	exists(bar, true, '~> (bar) dir exists');

	await premove(bar); // cleanup
	exists(bar, false, '~> (bar) removed');
});

test('remove directory and its contents', async () => {
	let file = await touch('./foo/bar.txt');
	let dir = dirname(file);

	exists(dir, true, '(setup) dir exists');
	exists(file, true, '(setup) file exists');

	let output = await premove(dir);
	assert.is(output, true, '~> (dir) existed');

	exists(dir, false, '~> (dir) removed');
	exists(file, false, '~> (file) removed');
});

test('remove directory, leave parent', async () => {
	let file = await touch('./foo/bar/baz/bat/hello.txt');
	let baz = resolve('./foo/bar/baz');
	let dir = dirname(file);

	exists(dir, true, '(setup) dir exists');
	exists(file, true, '(setup) file exists');
	exists(baz, true, '(setup) "baz" exists');

	let output = await premove(dir);
	assert.is(output, true, '~> (dir) existed');

	exists(dir, false, '~> (dir) removed');
	exists(file, false, '~> (file) removed');
	exists(baz, true, '~> (baz) still exists');

	let foo = resolve('./foo');
	await premove(foo);
	exists(foo, false, '~> cleanup');
});

test('remove directory recursively', async () => {
	let f1 = await touch('./foo/bar/baz/bat/hello.txt');
	let f2 = await touch('./foo/bar/baz/bat/world.txt');
	let f3 = await touch('./foo/bar/baz/hello.txt');
	let f4 = await touch('./foo/hello.txt');

	let dir = resolve('./foo');

	exists(dir, true, '(setup) dir exists');
	exists(f1, true, '(setup) f1 exists');
	exists(f2, true, '(setup) f2 exists');
	exists(f3, true, '(setup) f3 exists');
	exists(f4, true, '(setup) f4 exists');

	let output = await premove(dir);
	assert.is(output, true, '~> (dir) existed');

	exists(dir, false, '~> (dir) removed');
	exists(f1, false, '~> (f1) removed');
	exists(f2, false, '~> (f2) removed');
	exists(f3, false, '~> (f3) removed');
	exists(f4, false, '~> (f4) removed');
});

test('file does not exist', async () => {
	let file = await premove('./404.txt');
	assert.is(file, false, '~> (file) returns false when missing');

	let dir = await premove('./foo');
	assert.is(dir, false, '~> (dir) returns false when missing');
});

test('options.cwd', async () => {
	let file = await touch('./foo/hello.txt');
	let dir = dirname(file);

	exists(file, true, '(setup) file exists');
	await premove('hello.txt', { cwd: dir });
	exists(file, false, '~> removed file');

	let output = await premove(dir);
	assert.is(output, true, '~> (dir) existed');
	exists(dir, false, '~> cleanup');
});

test.run();
