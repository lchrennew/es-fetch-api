import { asEvents, asJSON, asText } from "./response.js";
import { getApi } from "../fetch.js";

const isAbsoluteUrl = value => {
    try {
        return typeof value === 'string' && !!new URL(value)
    } catch {
        return false
    }
}

export class Fetcher {
    /**
     * @type {string | URL | (() => string | URL | undefined | Promise<string | URL | undefined>) | undefined}
     */
    #getBaseUrl;

    #middlewares = [];
    #errorHandler;

    constructor(getBaseUrl, ...middlewares) {
        this.#getBaseUrl = getBaseUrl;
        this.#middlewares = middlewares.flat()
        this.exec = this.exec.bind(this)
        this.onError = this.onError.bind(this)
        this.use = this.use.bind(this)
        this.getText = this.getText.bind(this)
        this.getJSON = this.getJSON.bind(this)
        this.getEvents = this.getEvents.bind(this)
    }

    async #throwError(error) {
        await this.#errorHandler?.(error)
        throw error
    }

    onError(errorHandler) {
        this.#errorHandler = errorHandler
        return this
    }

    use(...middlewares) {
        this.#middlewares.push(...middlewares.flat());
        return this
    }

    async exec(...args) {
        try {
            const baseUrl =
                typeof this.#getBaseUrl === 'function'
                    ? await this.#getBaseUrl()
                    : this.#getBaseUrl
            const endpoint = typeof args[0] === 'string' ? args[0] : undefined
            if (!baseUrl && !isAbsoluteUrl(endpoint))
                throw new TypeError(
                    'Fetcher.exec() requires a baseUrl or an absolute endpoint.'
                )
            const api = getApi(baseUrl);
            return await api(...args, ...this.#middlewares)
        } catch (error) {
            return this.#throwError(error)
        }
    }

    async getText(...args) {
        const response = await this.exec(...args)
        try {
            return await asText(response)
        } catch (error) {
            return this.#throwError(error)
        }
    }

    async getJSON(...args) {
        const response = await this.exec(...args)
        try {
            return await asJSON(response)
        } catch (error) {
            return this.#throwError(error)
        }
    }

    getEvents(...args) {
        return {
            on: async onEvent => {
                const response = await this.exec(...args)
                try {
                    return await asEvents(response, onEvent)
                } catch (error) {
                    return this.#throwError(error)
                }
            }
        }
    }
}
