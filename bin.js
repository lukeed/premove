#!/usr/bin/env node
const { homedir } = require('os');
const { normalize, resolve } = require('path');
const { premove } = require('./sync');

const argv = process.argv.slice(2);

if (argv.includes('--help') || argv.includes('-h')) {
	let msg = '\n  Description\n    Remove all items recursively\n';
	msg += '\n  Usage\n    $ premove [options] [...paths]\n';
	msg += '\n  Options';
	msg += '\n    --cwd     Directory to resolve from (default ".")';
	msg += '\n    --help    Displays this message\n';
	console.log(msg); process.exit(0);
}

let cwd = resolve('.');
let idx = argv.indexOf('--cwd');

if (idx !== -1) {
	let num = 1;
	if ((idx + 1) !== argv.length) {
		cwd = resolve(cwd, argv[idx + num++]);
	}
	argv.splice(idx, num);
}

const home = homedir();
const isFlag = /^-{1,2}/;
const isRoot = /^(\/|[a-zA-Z]:\\)$/;

let i=0, tmp, dirs=[];
for (; i < argv.length; i++) {
	tmp = argv[i];
	if (!tmp || isFlag.test(tmp)) continue;

	tmp = normalize(resolve(cwd, tmp));
	if (tmp === home || isRoot.test(tmp)) {
		console.error('! will not remove home and/or root directory :: "%s"', argv[i]);
		continue;
	}

	if (!tmp.startsWith(cwd)) {
		console.error('! will not remove items outside `--cwd` scope :: "%s"', argv[i]);
		continue;
	}

	dirs.push(tmp);
}

dirs.sort(); // length
for (i=0; i < dirs.length;) {
	premove(dirs[i++]);
}
