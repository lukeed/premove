import * as fs from 'fs';
import { join, resolve } from 'path';

const rmSync = fs.rmSync || null;

function walker(str) {
	let stats = fs.statSync(str);
	if (stats.isDirectory()) {
		fs.readdirSync(str).forEach(name => {
			walker(join(str, name));
		});
		fs.rmdirSync(str);
	} else fs.unlinkSync(str);
}

export function premove(dir, opts={}) {
	let bool, str = resolve(opts.cwd || '.', dir);
	if (bool=fs.existsSync(str)) {
		// Prefer the native recursive remove when available (Node >= 14.14);
		// fall back to the manual walker on older runtimes.
		if (rmSync) rmSync(str, { recursive: true });
		else walker(str);
	}
	return bool;
}
