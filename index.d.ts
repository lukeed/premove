declare module 'premove' {
	export type Options = { cwd: string };
	function premove(filepath: string, options?: Partial<Options>): Promise<void> | false;
	export = premove;
}

declare module 'premove/sync' {
	export type Options = { cwd: string };
	function premove(filepath: string, options?: Partial<Options>): void | false;
	export = premove;
}
