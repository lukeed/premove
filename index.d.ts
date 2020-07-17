declare namespace premove {
	type Options = { cwd: string };
}

declare module 'premove' {
	function premove(filepath: string, options?: Partial<premove.Options>): Promise<void> | false;
	export = premove;
}

declare module 'premove/sync' {
	function premove(filepath: string, options?: Partial<premove.Options>): void | false;
	export = premove;
}
