declare namespace premove {
	type Options = { cwd: string };
}

declare module 'premove' {
	export function premove(filepath: string, options?: Partial<premove.Options>): Promise<void> | false;
}

declare module 'premove/sync' {
	export function premove(filepath: string, options?: Partial<premove.Options>): void | false;
}
