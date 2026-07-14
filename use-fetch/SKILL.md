---
name: use-fetch
description: 当用户要调用远程 HTTP 接口、封装 API 客户端或构造带认证/参数/请求体的请求时使用。适用于 GET/POST/PUT/DELETE 请求、查询参数、JSON/表单请求体、文件上传、请求头（如 Token）、取消请求。即使用户未明确提及"fetch"、"API"或"HTTP"，只要涉及调用后端接口、请求远程数据或与服务器交互，也应使用本技能。
compatibility: 适用于当前 JavaScript ESM 项目；依赖 fetch、URL、FormData、AbortController 和网络访问能力。
---

# use-fetch

指导智能体在当前项目正确使用 `es-fetch-api` 发起远程接口调用。

## When to use

- 用户要求调用远程 HTTP/REST 接口或封装 API
- 用户要求追加查询参数、请求头、JSON/Form 请求体、文件上传或取消请求
- 代码库已使用或应使用 `Fetcher`、中间件链

## Core approach

1. 用 `new Fetcher(baseUrl, ...commonMiddlewares)` 创建客户端（[baseUrl 支持](references/url-behavior.md#base-url-行为)字符串、异步函数或 `undefined`）
2. 默认优先从 `fetcher` 解构出 `getJSON()`、`getText()`、`getEvents(...).on(...)` 使用
3. 当你需要状态码分支、响应头、`response.context`、自定义响应体解析，或 `getJSON()` / `getText()` / `getEvents()` 无法覆盖时，使用 `exec()`
4. 中间件顺序：方法 → 参数/请求体 → 认证/业务头 → 其他
5. 公共逻辑优先通过构造函数传入公共中间件
6. 统一错误拦截可使用 `fetcher.onError(errorHandler)`

## Default import

```javascript
import { Fetcher, POST, json, query, header, abortable } from 'es-fetch-api'
```

## Quick reference

完整行为见 [middleware.md](references/middleware.md)

| 需求 | 中间件 | 关键点 |
|------|--------|--------|
| JSON 请求体 | `json(obj)` | 方法需显式传 `POST`/`PUT`/`PATCH` |
| 表单请求体 | `form(obj)` | - |
| 文件上传 | `file(name, file, filename?)` | 已自带 `POST` |
| 查询参数 | `query(params, options?)` | 第二参数是配置对象 |
| 批量请求头 | `header(obj)` | 动态头用自定义中间件 |
| 取消请求 | `abortable(controller)` | - |
| 原始响应 | `fetcher.exec()` | 用于状态码判断、读取 headers、深度定制 |
| 统一错误处理 | `fetcher.onError(handler)` | 默认拦截后仍继续抛错 |

## Gotchas

这些是非显而易见的行为，不知道会出错：

- **`getJSON()` / `getText()` 会直接消费响应体**：如果要自己判断 `response.ok`、读取 headers 或自定义解析，请改用 `exec()`
- **`json()` 不会自动设置方法**：必须显式传 `POST`/`PUT`/`PATCH`，否则仍是 `GET`
- **自定义中间件必须调用 `next()`**：否则中间件链中断，请求不会真正发送
- **`file()` 返回中间件数组**：不要再包一层数组，直接展开即可
- **`query()` 第二参数是配置对象**：不是布尔值，支持 `{ append, includeUndefined, includeNull }`
- **相对 endpoint 需要 baseUrl**：如果 `baseUrl` 是 `undefined`，`endpoint` 必须是绝对 URL
- **事件流读取使用 `.on()`**：`fetcher.getEvents('/stream').on(onEvent)`，不要把回调直接传给 `getEvents()`
- **`onError()` 默认不会吞错**：handler 执行后原错误仍会继续抛出；如果要改错误形态，请在 handler 里抛出新错误

更多坑点见 [pitfalls.md](references/pitfalls.md)

## Examples

[GET](references/examples/get-query.md) · [POST JSON](references/examples/post-json.md) · [POST Form](references/examples/post-form.md) · [文件上传](references/examples/file-upload.md) · [动态 baseUrl](references/examples/dynamic-baseurl.md) · [公共中间件](references/examples/shared-middleware.md) · [可取消请求](references/examples/abortable.md) · [统一响应处理](references/examples/unified-handler.md)
