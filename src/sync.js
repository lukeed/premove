import * as fs from 'fs';
import { join, resolve } from 'path';

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
	let str = resolve(opts.cwd || '.', dir);
	return fs.existsSync(str) && walker(str);
}
