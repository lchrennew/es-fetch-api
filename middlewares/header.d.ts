import { Middleware } from '../index';

export const header: (obj: Record<string, string>) => Middleware;
