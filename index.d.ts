export type Middleware = (ctx: WebApiContext, next: () => Promise<Response>) => Promise<Response>;

export const use: (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) => void;

export const credentials: {
    omit: 'omit';
    include: 'include';
    sameOrigin: 'same-origin';
};

export const mode: {
    cors: 'cors';
    noCors: 'no-cors';
    sameOrigin: 'same-origin';
    navigate: 'navigate';
};

export const methods: {
    GET: 'GET';
    POST: 'POST';
    PUT: 'PUT';
    DELETE: 'DELETE';
    HEAD: 'HEAD';
    CONNECT: 'CONNECT';
    OPTIONS: 'OPTIONS';
    TRACE: 'TRACE';
    PATCH: 'PATCH';
};

export const caches: {
    default: 'default';
    noStore: 'no-store';
    reload: 'reload';
    noCache: 'no-cache';
    forceCache: 'force-cache';
    onlyIfCached: 'only-if-cached';
};

export const redirects: {
    follow: 'follow';
    error: 'error';
    manual: 'manual';
};

export const referrers: {
    noReferrer: '';
    client: 'about:client';
};

export class WebApiContext {
    url: URL;
    method: string;
    mode: string;
    credentials: string;
    redirect: string;
    cache: string;
    referrer: string;
    headers: Record<string, string>;
    body?: BodyInit;
    signal?: AbortSignal;
    response?: Response;

    constructor(webApi: string | (() => string | Promise<string>), endpoint?: string);

    header(key: string, value: string): this;
    header(headers: Record<string, string>): this;

    commit(): Promise<Response>;
}

export const getApi: (webApi: string | (() => string | Promise<string>)) => (endpoint?: string, ...middlewares: (Middleware | Middleware[])[]) => Promise<Response>;
