# Unified Response Handler

统一响应处理器示例，集中处理错误和数据解析。

```javascript
import { Fetcher, POST, json, query } from 'es-fetch-api'

const { exec } = new Fetcher('https://example.com/api/v1')
    .onError(error => {
        console.error('[api-error]', error)
    })

const handleResponse = async (...args) => {
    const response = await exec(...args)

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.message ?? response.statusText)
    }

    return response.json()
}

export const getUser = id => handleResponse('users/detail', query({ id }))
export const createUser = payload => handleResponse('users', POST, json(payload))
```

优点：
- 集中处理 HTTP 错误状态
- 统一响应体解析逻辑
- 可以叠加 `onError()` 做统一日志或监控
- 避免在每个接口函数中重复错误处理代码

注意：
- `exec()` 返回原生 `Response`，不是 axios 风格对象
- 需要显式调用 `response.json()` 或 `response.text()` 解析响应体
