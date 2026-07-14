# Shared Middleware

通过 `Fetcher` 构造函数注入公共中间件的示例。

```javascript
import { Fetcher, POST, json } from 'es-fetch-api'
import { getToken } from './auth'

const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Bearer ${await getToken()}`)
    return next()
}

const useTimestamp = (ctx, next) => {
    ctx.header('X-Timestamp', String(Date.now()))
    return next()
}

const { getJSON, exec } = new Fetcher(
    'https://example.com/api/v1',
    useToken,
    useTimestamp
)

export const createUser = payload => getJSON('users', POST, json(payload))
export const getUser = id => exec(`users/${id}`)
```

适用场景：
- 统一鉴权（Token、API Key）
- 统一追加时间戳、请求 ID、租户 ID
- 统一日志记录或性能监控
