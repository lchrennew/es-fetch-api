import type {
    MiddlewareInput,
    WebApi,
    WebApiResponse
} from '../fetch.js';

type BaseUrlGetter = (() => WebApi | Promise<WebApi>) | undefined;
type BaseUrlInput = WebApi | BaseUrlGetter;
type EventPayload = {
    [key: string]: unknown;
};
type ErrorHandler = (error: unknown) => void | Promise<void>;
type EventHandler = (event: EventPayload) => void | Promise<void>;
type EventBinding = {
    on(onEvent?: EventHandler): Promise<WebApiResponse>;
};

export declare class Fetcher {
    constructor(getBaseUrl?: BaseUrlInput, ...middlewares: MiddlewareInput[]);
    onError(errorHandler?: ErrorHandler): this;
    use(...middlewares: MiddlewareInput[]): this;
    exec(endpoint: string, ...middlewares: MiddlewareInput[]): Promise<WebApiResponse>;
    exec(...middlewares: MiddlewareInput[]): Promise<WebApiResponse>;
    getText(endpoint: string, ...middlewares: MiddlewareInput[]): Promise<string>;
    getText(...middlewares: MiddlewareInput[]): Promise<string>;
    getJSON<T = unknown>(
        endpoint: string,
        ...middlewares: MiddlewareInput[]
    ): Promise<T>;
    getJSON<T = unknown>(...middlewares: MiddlewareInput[]): Promise<T>;
    getEvents(endpoint: string, ...middlewares: MiddlewareInput[]): EventBinding;
    getEvents(...middlewares: MiddlewareInput[]): EventBinding;
}
