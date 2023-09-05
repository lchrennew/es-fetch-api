export const query = (params, options) => {
    const { append = false, includeUndefined = false, includeNull = false } = options ?? {}
    const appendValue = (ctx, name, value) => {
        if (value === undefined && !includeUndefined) return
        if (value === null && !includeNull) return
        ctx.url.searchParams.append(name, value)
    }
    return (ctx, next) => {
        const appendArray = (name, ...values) => values.forEach(value => appendValue(ctx, name, value))
        for (const paramName in params) {
            const paramValue = params[paramName]
            if (!append) ctx.url.searchParams.delete(paramName)
            const multiple = paramValue instanceof Array
            if (multiple) appendArray(paramName, ...paramValue)
            else appendValue(ctx, paramName, paramValue)
        }
        return next()
    }
}
