export const abortable = controller => async (ctx, next) => {
    ctx.signal = controller.signal
    return await next()
}
