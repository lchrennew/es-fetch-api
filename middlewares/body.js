import { POST } from "./methods.js";

export const json = obj => (ctx, next) => {
    ctx.header('Content-Type', 'application/json');
    ctx.body = JSON.stringify(obj);
    return next()
};

export const form = obj => (ctx, next) => {
    ctx.header('Content-Type', 'application/x-www-form-urlencoded')
    ctx.body = `${new URLSearchParams(obj)}`
    return next()
}

export const file = (name, file, filename) => [
    POST,
    (ctx, next) => {
        if (!ctx.body)
            ctx.body = new FormData()
        if (filename)
            ctx.body.append(name, file, filename)
        else
            ctx.body.append(name, file)
        return next()
    }
]
