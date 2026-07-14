import type { HeaderValue, Middleware } from '../fetch.js';

export declare const header: (obj: Record<string, HeaderValue>) => Middleware;
