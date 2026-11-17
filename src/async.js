import * as fs from 'fs';
import { promisify } from 'util';
import { join, resolve } from 'path';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const rm = fs.rm ? promisify(fs.rm) : null;

async function walker(str) {
	let stats = await stat(str);
	if (stats.isDirectory()) {
		let files = await readdir(str);
		await Promise.all(files.map(x => walker(join(str, x))));
		return rmdir(str);
	}
	return unlink(str);
}

export async function premove(dir, opts={}) {
	let bool, str = resolve(opts.cwd || '.', dir);
	if (bool=fs.existsSync(str)) {
		// Prefer the native recursive remove when available (Node >= 14.14);
		// fall back to the manual walker on older runtimes.
		if (rm) await rm(str, { recursive: true });
		else await walker(str);
	}
	return bool;
}
