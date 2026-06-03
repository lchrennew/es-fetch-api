# Middleware Reference

本文件提供所有内建中间件的完整行为说明和示例。

## Method middleware

- `method(name)`：设置任意 HTTP 方法
- `GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD`、`OPTIONS`、`TRACE`、`CONNECT`：方法别名

示例：

```javascript
api('users/1', DELETE)
api('users/1', method('HEAD'))
```

## `json(obj)`

- 设置 `Content-Type: application/json`
- 将 `ctx.body` 写成 `JSON.stringify(obj)`
- 常与 `POST`、`PUT`、`PATCH` 搭配

示例：

```javascript
import { getApi, POST, json } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')
export const createUser = payload => api('users', POST, json(payload))
```

## `form(obj)`

- 设置 `Content-Type: application/x-www-form-urlencoded`
- 将对象编码为 `URLSearchParams`

示例：

```javascript
import { getApi, POST, form } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')
export const login = payload => api('login', POST, form(payload))
```

## `file(name, file, filename?)`

- 创建或复用 `FormData`
- 自动追加 `POST`
- 第三个参数可覆盖上传文件名

示例：

```javascript
import { getApi, file } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')
export const uploadAvatar = avatarFile => api('users/avatar', file('avatar', avatarFile))
```

## `query(params, options?)`

第二个参数是配置对象，支持：

- `append`: 是否在原有参数基础上追加，默认 `false`
- `includeUndefined`: 是否保留 `undefined`，默认 `false`
- `includeNull`: 是否保留 `null`，默认 `false`

示例：

```javascript
api('users', query({ id: 1, role: ['admin', 'editor'] }))
api('users', query({ page: 2 }, { append: true }))
api('users', query({ q: undefined }, { includeUndefined: true }))
```

## `header(obj)`

将对象批量合并到请求头：

```javascript
api('users', header({ Authorization: token, 'X-Tenant': tenantId }))
```

## `abortable(controller)`

将 `controller.signal` 注入请求，供取消或超时控制使用。

示例：

```javascript
import { getApi, abortable, query } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')
export const searchUsers = (keyword, controller) =>
    api('users/search', query({ keyword }), abortable(controller))
```
