import type { Middleware } from '../fetch.js';

export declare const method: (m: string) => Middleware;
export declare const GET: Middleware;
export declare const POST: Middleware;
export declare const PUT: Middleware;
export declare const DELETE: Middleware;
export declare const PATCH: Middleware;
export declare const CONNECT: Middleware;
export declare const HEAD: Middleware;
export declare const OPTIONS: Middleware;
export declare const TRACE: Middleware;
