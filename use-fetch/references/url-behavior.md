# URL Behavior

本文件说明 URL 相关行为，包括 baseUrl 支持和 endpoint 拼接规则。

## Base URL 行为

`getApi(baseUrl)` 的 `baseUrl` 参数支持：

- **字符串**：固定的基础地址
- **异步函数**：返回基础地址的函数，每次请求时会自动调用并等待
- **`undefined`**：如果不传或传 `undefined`，则 `endpoint` 必须是绝对 URL，否则会抛出错误

示例：

```javascript
// 固定基础地址
const api = getApi('https://example.com/api/v1')

// 动态基础地址（从配置或环境变量读取）
const api = getApi(async () => {
    const config = await fetchConfig()
    return config.apiBaseUrl
})

// 不传 baseUrl，endpoint 必须是绝对 URL
const api = getApi()
api('https://example.com/api/v1/users')  // ✓ 可行
api('users')                              // ✗ 报错：Invalid URL
```

## Endpoint 拼接规则

写 endpoint 时注意：

- `getApi(baseUrl)` + 相对 `endpoint` 会自动拼接并去掉多余斜杠
- 如果 `endpoint` 本身是绝对 URL，会直接使用该 URL，而不是拼到 `baseUrl`
- `endpoint` 可省略，此时直接请求基础地址

示例：

```javascript
const api = getApi('https://example.com/api/v1/')

api('users')                  // => https://example.com/api/v1/users
api('/users/')                // => https://example.com/api/v1/users
api('https://other.com/ping') // => https://other.com/ping
```
