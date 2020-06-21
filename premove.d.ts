declare module 'premove' {
	export type Options = { cwd: string };
	export type Result = Promise<void> | false;
	function premove(filepath: string, options?: Partial<Options>): Result;
	export = premove;
}
