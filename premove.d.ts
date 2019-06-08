export interface Options {
	cwd: string
}
export type Result = Promise<void> | false;
declare const premove: (filepath: string, options?: Partial<Options>) => Result;
export default premove;
