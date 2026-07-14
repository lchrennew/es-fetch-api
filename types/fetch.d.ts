export type HeaderValue = string | number | boolean;
export type HeadersObject = Record<string, HeaderValue>;
export type WebApi = string | URL | undefined;
export type WebApiResponse = Response & { context: WebApiContext };
export type Next = () => Promise<WebApiResponse>;
export interface Middleware {
    (ctx: WebApiContext, next: Next): WebApiResponse | Promise<WebApiResponse>;
}
export type MiddlewareInput = Middleware | readonly Middleware[];
export declare class WebApiContext {
    url: URL;
    method: string;
    mode: RequestMode;
    credentials: RequestCredentials;
    redirect: RequestRedirect;
    cache: RequestCache;
    referrer: string;
    headers?: HeadersObject;
    body?: BodyInit | null;
    signal?: AbortSignal | null;
    response?: WebApiResponse;
    constructor(webApi?: WebApi, endpoint?: string);
    header(key: string): HeaderValue | undefined;
    header(key: string, value: HeaderValue): this;
    header(key: HeadersObject): this;
    commit(): Promise<WebApiResponse>;
}
