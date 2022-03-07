export const abortable = controller => (ctx, next) => {
    ctx.signal = controller.signal
    return next()
}
