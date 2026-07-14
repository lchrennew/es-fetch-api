# URL Behavior

本文件说明 URL 相关行为，包括 baseUrl 支持和 endpoint 拼接规则。

## Base URL 行为

`new Fetcher(baseUrl)` 的 `baseUrl` 参数支持：

- **字符串**：固定的基础地址
- **异步函数**：返回基础地址的函数，每次请求时会自动调用并等待
- **`undefined`**：如果不传或传 `undefined`，则 `endpoint` 必须是绝对 URL，否则会抛出错误

示例：

```javascript
import { Fetcher } from 'es-fetch-api'

const fixedFetcher = new Fetcher('https://example.com/api/v1')

const dynamicFetcher = new Fetcher(async () => {
    const config = await fetchConfig()
    return config.apiBaseUrl
})

const rawFetcher = new Fetcher()
rawFetcher.exec('https://example.com/api/v1/users') // ✓ 可行
rawFetcher.exec('users') // ✗ 报错：Invalid URL
```

## Endpoint 拼接规则

写 endpoint 时注意：

- `Fetcher(baseUrl)` + 相对 `endpoint` 会自动拼接并去掉多余斜杠
- 如果 `endpoint` 本身是绝对 URL，会直接使用该 URL，而不是拼到 `baseUrl`
- `endpoint` 可省略，此时直接请求基础地址

示例：

```javascript
const { exec } = new Fetcher('https://example.com/api/v1/')

exec('users')                  // => https://example.com/api/v1/users
exec('/users/')                // => https://example.com/api/v1/users
exec('https://other.com/ping') // => https://other.com/ping
```
