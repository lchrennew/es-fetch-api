import type { Middleware } from '../fetch.js';

export declare const abortable: (controller: AbortController) => Middleware;
