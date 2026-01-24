import { Middleware } from '../index';

export interface QueryOptions {
    append?: boolean;
    includeUndefined?: boolean;
    includeNull?: boolean;
}

export const query: (params: Record<string, any>, options?: QueryOptions) => Middleware;
