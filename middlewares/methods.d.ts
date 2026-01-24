import { Middleware } from '../index';

export const method: (m: string) => Middleware;

export const GET: Middleware;
export const POST: Middleware;
export const PUT: Middleware;
export const DELETE: Middleware;
export const PATCH: Middleware;
export const CONNECT: Middleware;
export const HEAD: Middleware;
export const OPTIONS: Middleware;
export const TRACE: Middleware;
