# Custom Middleware Guide

本文件说明如何编写自定义中间件。

## Middleware contract

自定义中间件必须遵循以下签名：

```javascript
const middleware = async (ctx, next) => {
    // 在这里修改 ctx
    return next()
}
```

## Context operations

编写自定义中间件时：

- 通过 `ctx.header(key, value)` 或 `ctx.header(object)` 设置请求头
- 通过 `ctx.url.searchParams` 或 `query()` 处理中查询参数
- 通过 `ctx.body` 设置请求体
- 必须继续调用 `next()`，否则请求不会真正发送
- 只在确实需要时再直接改 `ctx.method`、`ctx.mode`、`ctx.credentials` 等字段

## Context defaults

当前库里的 `ctx` 具备以下默认值：

- `method`: `GET`
- `mode`: `cors`
- `credentials`: `include`
- `redirect`: `follow`
- `cache`: `default`
- `referrer`: `about:client`
- `url`: `URL` 实例，可直接操作 `searchParams`
- `header()`: 既可读取单个头，也可批量写入头

## Shared auth example

```javascript
import { Fetcher, POST, json } from 'es-fetch-api'

const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Bearer ${await getToken()}`)
    return next()
}

const useTimestamp = (ctx, next) => {
    ctx.header('X-Timestamp', String(Date.now()))
    return next()
}

const { getJSON } = new Fetcher(
    'https://example.com/api/v1',
    useToken,
    useTimestamp
)

export const createUser = payload => getJSON('users', POST, json(payload))
```
