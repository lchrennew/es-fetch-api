import { Middleware } from '../index';

export const abortable: (controller: AbortController) => Middleware;
