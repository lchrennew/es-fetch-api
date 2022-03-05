import { POST } from "./methods.js";

export const json = obj => async (ctx, next) => {
    ctx.header('Content-Type', 'application/json');
    ctx.body = JSON.stringify(obj);
    return await next()
};

export const form = obj => async (ctx, next) => {
    ctx.header('Content-Type', 'application/x-www-form-urlencoded')
    ctx.body = `${new URLSearchParams(obj)}`
    return await next()
}

export const file = (name, file, filename) => [
    POST,
    async (ctx, next) => {
        if (!ctx.body)
            ctx.body = new FormData()
        if (filename)
            ctx.body.append(name, file, filename)
        else
            ctx.body.append(name, file)
        return await next()
    }
]
