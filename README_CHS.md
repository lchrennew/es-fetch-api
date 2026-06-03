# ES-Fetch-API
中文  |  [English](./README.md)

特别强大而且可扩展的 HTTP 客户端，适用于所有支持 Fetch API 的现代 JavaScript 运行时！

![NPM](https://img.shields.io/npm/l/es-fetch-api)
![npm](https://img.shields.io/npm/v/es-fetch-api)
![GitHub package.json version](https://img.shields.io/github/package-json/v/lchrennew/es-fetch-api)
![GitHub file size in bytes](https://img.shields.io/github/size/lchrennew/es-fetch-api/fetch.js)
![GitHub issues](https://img.shields.io/github/issues-raw/lchrennew/es-fetch-api)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/lchrennew/es-fetch-api)

## AI Agent 支持

本项目为 AI Agent（如 Trae, Cursor 等）提供了内置的 Skills 支持，帮助 AI 理解并编写基于 `es-fetch-api` 的代码。

- [AI Skills 使用指南](./SKILL.md)

### 安装 Skills

在项目根目录下运行以下命令，将 AI Skills 安装到 `.ai/skills` 和 `.agent/skills` 目录：

```bash
npx add-skill lchrennew/es-fetch-api
```

## 为什么要用 ES-Fetch-API？

还在用 `axios`？`ES-Fetch-API` 让代码更轻、更清晰。

### i. 超级轻量，基于原生 Fetch API 打造

`axios` 大约 400kB，相比之下，`es-fetch-api` 源码只有约 6kB。这是因为它专门为支持原生 Fetch API 的现代 JavaScript 运行时而设计。

参考：

1. [MDN 上的 Fetch API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. [WHATWG 上的 Fetch API 文档](https://fetch.spec.whatwg.org/)

### ii. 让最强可读性、可扩展性、可维护性以及最低复杂性成为可能

#### 1. 最简单的例子

期望的请求：

```http
GET http://yourdomain.com/api/v1/user?id=12345
```

用 axios 实现：

```javascript
import axios from 'axios'

// 没必要声明'http://yourdomain.com/api/v1'的意思是baseURL
const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// 没必要声明`/user`的意思是URL
const getUser = id => apiV1.get({ url: `/user`, params: { id } })

const response = await getUser(12345)
```

用 `es-fetch-api` 实现，可读性更好：

```javascript
import { getApi, query } from "es-fetch-api";

// 言简意赅
const apiV1 = getApi('http://yourdomain.com/api/v1')

const getUser = id => apiV1(`user`, query({ id }))

const response = await getUser(12345)
```

#### 2. 更复杂一点的例子（使用内建的中间件）

期望的请求：

```http
POST http://yourdomain.com/api/v1/user/
Content-Type: application/json

{"firstName":"Fred","lastName":"Flintstone"}
```


使用axios实现：


```javascript

import axios from 'axios'

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// POST 数据该用什么格式呢？
const createUser = user => apiV1.post(`/user`, user)

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

使用 `es-fetch-api` 来获得更好的可读性：

```javascript
import { getApi, json, POST } from "es-fetch-api";

const apiV1 = getApi('http://yourdomain.com/api/v1')

// 看见什么写什么，而且信息不失真
const createUser = user => apiV1(`user`, POST, json(user))

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

#### 3. 在保持可读性的同时，用自定义中间件扩展代码

期望的请求：

```http
POST http://yourdomain.com/api/v1/user/
Content-Type: application/json
Authorization: Token ********
X-Timestamp: ##########

{"firstName":"Fred","lastName":"Flintstone"}
```

使用axios实现：

```javascript
import axios from 'axios'
import { getToken } from 'token-helper'

// 容易读懂吗？几乎没办法确定这两个函数返回的是请求头
const useToken = async () => ({ 'Authorization': `Token ${await getToken()}` })
const useTimestamp = () => ({ 'X-Timestamp': Date.now() })

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// 容易读懂吗？可能不同的人看法就不一样了，但无论如何，这么写代码太啰哩啰嗦了，咋维护啊？
const createUser = async user => apiV1.post({
    url: `/user`,
    data: user,
    headers: { ...await useToken(), ...useTimestamp() }
})

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

使用 `es-fetch-api`，可读性和可维护性都更好：

```javascript
import { getApi, json, POST } from "es-fetch-api";
import { getToken } from 'token-helper'

// 所见即所读
const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Token ${await getToken()}`)
    return next()
}
const useTimestamp = (ctx, next) => {
    ctx.header('X-Timestamp', Date.now())
    return next()
}

const apiV1 = getApi('http://yourdomain.com/api/v1')

// 看见什么写什么，信息不走样
const createUser = user => apiV1(`user`, POST, json(user), useToken, useTimestamp)

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

#### 4. 用自定义中间件处理所有调用

使用axios实现：

```javascript
import axios from 'axios'
import { getToken } from 'token-helper'

const useToken = async () => ({ 'Authorization': `Token ${await getToken()}` })
const useTimestamp = () => ({ 'X-Timestamp': Date.now() })

// headers是静态的，尤其是X-Timestamp，说好的每个请求时间戳不一样呢？容易维护吗？显然不容易！
const apiV1 = axios.create({
    baseURL: 'http://yourdomain.com/api/v1',
    headers: { ...await useToken(), ...useTimestamp() }
})

const createUser = user => apiV1.post({ url: `/user`, data: user, })
const getUser = id => apiV1.get({ url: `/user`, params: { id } })

```

使用 `es-fetch-api` 来获得更好的可读性和可维护性：

```javascript
import { getApi, json, POST } from "es-fetch-api";
import { getToken } from 'token-helper'

const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Token ${await getToken()}`)
    return next()
}
const useTimestamp = async (ctx, next) => {
    ctx.header('X-Timestamp', Date.now())
    return next()
}

// 只要把中间件追加到参数列表里即可，维护起来更直接
const apiV1 = (...args) => getApi('http://yourdomain.com/api/v1')(...args, useToken, useTimestamp)

const createUser = user => apiV1(`user`, POST, json(user))
```

#### 5. 处理响应

还以getUser函数为例。

如果用户存在，响应应该这样：

```text
Status: 200 OK
Content-Type: application/json
Body: {ok: true, data: {"firstName": "Chun", "lastName": "Li"}}
```

当用户不存在，响应应该这样：

```text
Status: 404 NotFound
Content-Type: application/json
Body: {ok: false, message: 'User doesn't exist.'}
```

使用axios：

```javascript
import axios from 'axios'

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })
const getUser = async id => {
    try {
        const response = await apiV1.get({ url: `/user`, params: { id } })
        console.log(response.status, response.statusText)
        // 这么多data，晕菜，别忘了在response后面还有个data，呵呵
        const { data } = response.data
        return data
    } catch (error) {
        // 我要用哪个error？
        console.log(error.response.data.message ?? error.message)
    }
}
```

使用 `es-fetch-api` 实现，可读性更强：

```javascript
import { getApi, query } from "es-fetch-api";

const apiV1 = getApi('http://yourdomain.com/api/v1')

const getUser = async id => {
    try {
        const response = await apiV1(`user`, query({ id }))
        console.log(response.status, response.statusText)
        const { ok, data, message } = await response.json() // 见着啥读啥
        if (!ok) throw { message }  // 想抛异常就抛
        return data
    } catch (error) {
        console.log(error.message)
    }
}
```

#### 6. 统一处理响应

使用axios实现：

```javascript
import axios from 'axios'

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

const getOne = async config => {
    try {
        const response = await apiV1(config)
        console.log(response.status, response.statusText)
        const { ok, data, message } = response.data
        return data
    } catch (error) {
        console.log(error.response.data.message ?? error.message)
    }
}
```

用 `es-fetch-api` 实现，可读性更强：

```javascript
import { getApi, query } from "es-fetch-api";

const apiV1 = getApi('http://yourdomain.com/api/v1')

const getOne = async (...args) => {
    try {
        const response = await apiV1(...args, useToken) // 你可以追加自定义中间件
        console.log(response.status, response.statusText)
        const { ok, data, message } = await response.json() // 看着啥读啥
        if (!ok) throw { message }  // 想抛异常就抛
        return data
    } catch (error) {
        console.log(error.message ?? error)
    }
}

// getOne可以统一处理每个响应。你还可以封装其他逻辑，比如getList
// 看着啥读啥
const getUser = id => getOne(`user`, query({ id }))
```

### 一句话理由

在es-fetch-api中，每次调用都是一条中间件链，采用这种结构意味着你能够在不引入更多复杂性的情况下，实现扩展，无论你单独处理请求和响应，还是采用任
何统一的方式。

## 内建中间件

现在内建中间件既可以从 `es-fetch-api` 导入，也可以从 `es-fetch-api/middlewares` 导入。下面的示例默认使用包根统一出口。

### `method`中间件

这个中间件用于设置HTTP请求使用的方法，它接收一个字符串参数用来传入方法名称。如果使用了不支持的方法名称，就会抛出异常。

```javascript
import { getApi, method } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

const response = api('/', method('DELETE'))
```

### `method`别名

`GET`、`POST`、`PUT`、`PATCH`和`DELETE`这几个中间件是对应`method`的缩写。

```javascript
import { getApi, DELETE } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

const response = api('/', DELETE)
```

### `json`中间件

这个中间件用于声明HTTP请求体数据是一个JSON对象。

这个中间件接收一个Object参数，用于传入请求体对象。

使用此中间件时，`Content-Type: application/json`头会被自动设置。

```javascript
import { getApi, POST, json } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

const response = api('/', POST, json({ hello, world }))
```

### `query`中间件

这个中间件用来声明请求URL中的查询字符串参数。

它接收两个参数。

1. 第一个是Object参数，这个对象的键被用于查询参数名，对应的值用于查询参数值。如果值是多元素的数组，就会设置成多值参数。
2. 第二个是个Boolean参数，用于指明是否将参数值追加到已有的参数上。默认为`false`。

```javascript
import { getApi, query } from "es-fetch-api";

const api = getApi('http://mydomain.com/api?hello=1')

api(query({ hello: 'world' })) // http://mydomain.com/api?hello=world
api(query({ hello: 'world' }, true)) // http://mydomain.com/api?hello=1&hello=world
api(query({ hello: [ 'Bing', 'Dwen', 'Dwen' ], world: '2022' })) // http://mydomain.com/api?hello=Bing&hello=Dwen&hello=Dwen&world=2022
```

### `form`中间件

这个中间件用于声明HTTP请求体是表单数据。

它接收一个Object参数来传入表单数据。

当你使用这个中间件，`Content-Type: application/x-www-form-urlencoded`请求头会被自动设置。

```javascript
import { getApi, form, POST } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

api(POST, form({ hello: 'world' })) // hello=world
```

### `file`中间件

这个中间件用于声明HTTP请求将上传文件。

它接收三个参数：

1. 文件所在表单域的名字
2. 一个`File`对象
3. 给定一个文件名，默认为原始文件名

### `abortable`中间件

这个中间件会将AbortController::signal注入到fetch中，这样，你就可以在需要的时候放弃请求了。

比如，你可以用它实现手动放弃、超时放弃等。

当AbortController::abort()被调用，就会有个异常抛出来。

```javascript
import { getApi, abortable } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')
const controller = new AbortController()
setTimeout(() => controller.abort(), 1000)
api(abortable(controller))
```

## 中间件开发

每个中间件 ****必须**** 遵循相同签名，并最终`return await next()`。

```javascript
const example = async (ctx, next) => {
    // TODO: 你的逻辑写在这
    return await next()
}
```

### 关于`ctx`的更多信息

`ctx`与[请求](https://fetch.spec.whatwg.org/#request-class) 完全相同，唯一不同的是， `ctx` 暴露了一个助手方法用来设置请求头，
本文档前面的`useToken`就是个很好的例子。

## 许可

[MIT](./LICENSE)

## 翻译

- [中文](./README_CHS.md)
- [英文](./README.md)
