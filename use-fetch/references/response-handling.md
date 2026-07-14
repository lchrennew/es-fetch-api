# Response Handling

本文件说明如何处理响应和调试请求上下文。

## 统一错误拦截

如果希望给整个客户端追加统一日志、上报或错误包装，可以使用 `onError()`：

```javascript
import { Fetcher } from 'es-fetch-api'

const fetcher = new Fetcher('https://example.com/api/v1')
    .onError(error => {
        console.error('[api-error]', error)
    })
```

注意：

- `onError()` 会覆盖 `exec()`、`getJSON()`、`getText()`、`getEvents(...).on(...)`
- 默认只做拦截，不会吞掉错误；handler 执行后原错误仍会继续抛出
- 如果要改成自定义错误，可以在 handler 里重新 `throw`

## 响应处理

默认可以直接使用 `getJSON()` / `getText()` 读取响应；如果需要自行处理状态码、headers 或上下文，请使用 `exec()`：

```javascript
import { Fetcher, query } from 'es-fetch-api'

const { exec } = new Fetcher('https://example.com/api/v1')

const response = await exec('users/detail', query({ id }))

if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.message ?? response.statusText)
}

const data = await response.json()
return data
```

## 调试上下文

如果需要调试请求上下文，可以使用：

```javascript
import { Fetcher } from 'es-fetch-api'

const { exec } = new Fetcher('https://example.com/api/v1')

const response = await exec('users')
console.log(response.context.url.toString())
console.log(response.context.headers)
```

`response.context` 包含：
- `url`：最终请求的 URL 对象
- `headers`：最终发送的请求头
- `method`、`mode`、`credentials` 等其他请求配置
