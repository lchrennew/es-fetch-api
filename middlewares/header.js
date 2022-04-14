export const header = obj => (ctx, next) => {
    ctx.header(obj)
    return next()
}
