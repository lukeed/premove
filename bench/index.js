// @ts-check
console.log('Load times:\n');

console.time('del');
const del = require('del');
console.timeEnd('del');

console.time('rimraf');
const rimraf = require('rimraf');
console.timeEnd('rimraf');

console.time('premove');
const { premove } = require('premove');
console.timeEnd('premove');

const fs = require('fs');
const { resolve } = require('path');
const { Suite } = require('benchmark');

const fixtures = resolve(__dirname, 'fixtures')

function touch(path) {
	let file = resolve(fixtures, path);
	fs.writeFileSync(file, 'hello');
}

function mkdir(path) {
	let dir = resolve(fixtures, path);
	fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });
}

/**
	fixtures
	├── foo-1
	│   ├── bar-1.txt
	│   ├── bar-2.txt
	│   └── bar-3
	│				├── baz-1.txt
	│				├── baz-2.txt
	│				└── baz-3
	│					├── bat-1.txt
	│					└── bat-2.txt
	└── foo-2
			├── hello.txt
			└── world.txt
 */
function setup() {
	try {
		mkdir('foo-1/bar-3/baz-3');
		touch('foo-1/bar-1.txt');
		touch('foo-1/bar-2.txt');
		touch('foo-1/bar-3/baz-1.txt');
		touch('foo-1/bar-3/baz-2.txt');
		touch('foo-1/bar-3/baz-3/bat-1.txt');
		touch('foo-1/bar-3/baz-3/bat-2.txt');

		mkdir('foo-2');
		touch('foo-2/hello.txt');
		touch('foo-2/world.txt');
	} catch (err) {
		console.log('SETUP', err.stack);
	}
}

const asyncs = {
	del,
	rimraf(input) {
		return new Promise((res, rej) => {
			rimraf(input, e => e ? rej(e) : res());
		});
	},
	premove,
};

const syncs = {
	del: del.sync,
	rimraf: rimraf.sync,
	premove: require('premove/sync').premove,
};

function runner(name, isAsync) {
	const label = isAsync ? 'async' : 'sync';
	const contenders = isAsync ? asyncs : syncs;
	console.log('\nBenchmark :: %s :: %s', label, name);

	const input = resolve(name);
	const bench = new Suite().on('cycle', e => {
		console.log('  ' + e.target);
	});

	Object.keys(contenders).forEach(name => {
		let lib = contenders[name];
		name = name + ' '.repeat(10 - name.length);
		if (isAsync) {
			bench.add(name, async () => {
				setup();
				await lib(input);
			}, { async: true });
		} else {
			bench.add(name, () => {
				setup();
				lib(input);
			});
		}
	});

	return new Promise((res, rej) => {
		bench.on('error', rej);
		bench.on('complete', res);
		bench.run();
	});
}

(async function () {
	// group: sync
	await runner('fixtures/foo-2/hello.txt', false);
	await runner('fixtures/foo-2', false);
	await runner('fixtures/foo-1/bar-3/baz-3/bat-1.txt', false);
	await runner('fixtures/foo-1', false);

	// group: async
	await runner('fixtures/foo-2/hello.txt', true);
	await runner('fixtures/foo-2', true);
	await runner('fixtures/foo-1/bar-3/baz-3/bat-1.txt', true);
	await runner('fixtures/foo-1', true);
})().catch(err => {
	console.error('ERROR', err.stack || err);
	process.exit(1);
});
