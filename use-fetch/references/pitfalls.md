# Common Pitfalls

本文件列出常见错误和避坑指南。

## 避免以下错误

- **`query()` 第二参数**：不要写成布尔值；当前实现接收的是配置对象 `{ append?, includeUndefined?, includeNull? }`

- **自定义中间件**：不要忘记调用 `next()`，否则中间件链会中断，请求不会真正发送

- **`json()` 中间件**：不要假设 `json()` 会自动设置 `POST`；方法仍需显式传入 `POST`/`PUT`/`PATCH`

- **`file()` 中间件**：不要给 `file()` 再额外重复包一层数组；它本身已经返回可展开的中间件数组

- **返回值类型**：不要误以为返回值是 axios 风格对象；返回的是原生 `Response`，需要调用 `response.json()` 或 `response.text()` 解析

- **退回手写 fetch**：不要在已经使用该库的代码里退回为手写大型 `fetch` 配置对象，除非用户明确要求

## 错误示例

```javascript
// ✗ 错误：query() 第二参数不是布尔值
api('users', query({ id: 1 }, true))

// ✓ 正确：第二参数是配置对象
api('users', query({ id: 1 }, { append: true }))
```

```javascript
// ✗ 错误：忘记调用 next()
const middleware = (ctx, next) => {
    ctx.header('X-Token', token)
    // 忘记 return next()
}

// ✓ 正确：必须调用 next()
const middleware = (ctx, next) => {
    ctx.header('X-Token', token)
    return next()
}
```

```javascript
// ✗ 错误：json() 不会自动设置方法
api('users', json({ name: 'John' }))

// ✓ 正确：显式传入方法
api('users', POST, json({ name: 'John' }))
```
