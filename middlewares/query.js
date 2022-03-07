export const query = (params, append = false) => (ctx, next) => {
    const appendValue = (name, value) => ctx.url.searchParams.append(name, value)
    const appendArray = (name, ...values) => values.forEach(value => appendValue(name, value))
    for (const paramName in params) {
        const paramValue = params[paramName]
        if (!append) ctx.url.searchParams.delete(paramName)
        const multiple = paramValue instanceof Array
        if (multiple) appendArray(paramName, ...paramValue)
        else appendValue(paramName, paramValue)
    }
    return next()
}
