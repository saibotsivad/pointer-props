export function toTokens(path: string): Array<string>;

export function toPointer(list: ArrayLike<string | number>): string;

export function get(obj: any, path: string | ArrayLike<string | number>): any;

export function set<T extends object, V>(obj: T, path: string | ArrayLike<string | number>, value: V): T;

export function del<T extends object>(obj: T, path: string | ArrayLike<string | number>): T;

export function resolve<T extends object>(obj: T, path: string | ArrayLike<string | number>): ArrayLike<string | number>;
