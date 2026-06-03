# Response Handling

本文件说明如何处理响应和调试请求上下文。

## 响应处理

这个库不会像部分 HTTP 客户端那样自动把响应体解包。应当按原生 `fetch` 习惯处理：

```javascript
const response = await api('users/detail', query({ id }))

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
const response = await api('users')
console.log(response.context.url.toString())
console.log(response.context.headers)
```

`response.context` 包含：
- `url`：最终请求的 URL 对象
- `headers`：最终发送的请求头
- `method`、`mode`、`credentials` 等其他请求配置
