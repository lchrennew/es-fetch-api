import type { Middleware } from '../fetch.js';

export type QueryPrimitive = string | number | boolean | null | undefined;
export type QueryValue = QueryPrimitive | readonly QueryPrimitive[];

export interface QueryOptions {
    append?: boolean;
    includeUndefined?: boolean;
    includeNull?: boolean;
}

export declare const query: (
    params: Record<string, QueryValue>,
    options?: QueryOptions
) => Middleware;
