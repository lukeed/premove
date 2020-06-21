import * as fs from 'fs';
import { promisify } from 'util';
import { join, resolve } from 'path';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);

async function walker(str) {
	let stats = await stat(str);
	if (stats.isDirectory()) {
		let files = await readdir(str);
		await Promise.all(files.map(x => walker(join(str, x))));
		return rmdir(str);
	}
	return unlink(str);
}

export default function (dir, opts={}) {
	let str = resolve(opts.cwd || '.', dir);
	return fs.existsSync(str) && walker(str);
}
