import { Middleware } from '../index';

export const json: (obj: any) => Middleware;
export const form: (obj: Record<string, string>) => Middleware;
export const file: (name: string, file: Blob | File, filename?: string) => Middleware[];
