# Shared Middleware

封装公共中间件并应用到所有请求的示例。

```javascript
import { getApi, POST, json } from 'es-fetch-api'
import { getToken } from './auth'

const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Bearer ${await getToken()}`)
    return next()
}

const useTimestamp = (ctx, next) => {
    ctx.header('X-Timestamp', String(Date.now()))
    return next()
}

const api = (...args) => 
    getApi('https://example.com/api/v1')(...args, useToken, useTimestamp)

export const createUser = payload => api('users', POST, json(payload))
export const getUser = id => api(`users/${id}`)
```

适用场景：
- 统一鉴权（Token、API Key）
- 统一追加时间戳、请求 ID、租户 ID
- 统一日志记录或性能监控
