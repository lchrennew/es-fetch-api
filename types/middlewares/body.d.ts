import type { Middleware } from '../fetch.js';

export type FormValue = string | number | boolean;

export declare const json: (obj: unknown) => Middleware;
export declare const form: (obj: Record<string, FormValue>) => Middleware;
export declare const file: (
    name: string,
    file: Blob,
    filename?: string
) => [Middleware, Middleware];
