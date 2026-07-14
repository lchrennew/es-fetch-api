# ES-Fetch-API

[中文](./README_CHS.md)  | English

Very powerful and extensible HTTP client for modern JavaScript runtimes with Fetch API support.

![NPM](https://img.shields.io/npm/l/es-fetch-api)
![npm](https://img.shields.io/npm/v/es-fetch-api)
![GitHub package.json version](https://img.shields.io/github/package-json/v/lchrennew/es-fetch-api)
![GitHub file size in bytes](https://img.shields.io/github/size/lchrennew/es-fetch-api/fetch.js)
![GitHub issues](https://img.shields.io/github/issues-raw/lchrennew/es-fetch-api)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/lchrennew/es-fetch-api)
[![CodeQL](https://github.com/lchrennew/es-fetch-api/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/lchrennew/es-fetch-api/actions/workflows/codeql-analysis.yml)

## AI Agent Support

This project provides built-in skills for AI agents (like Trae, Cursor, etc.) to understand and write code using `es-fetch-api`.

- [AI Skills Guide](./use-fetch/SKILL.md)

### Installation

Run the following command in your project root to install the AI skills to `.ai/skills` and `.agent/skills`:

```bash
npx add-skill lchrennew/es-fetch-api
```

## Why use ES-Fetch-API?

Still using `axios`? `ES-Fetch-API` keeps your code lighter and easier to read.

### i. It is extremely lightweight and built on the native Fetch API

Compared to axios at roughly 400kB, `es-fetch-api` is only about 6kB of source code because it is designed for
modern JavaScript runtimes that already support the native Fetch API.

References:

1. [Fetch API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. [Fetch API on WHATWG](https://fetch.spec.whatwg.org/)

### ii. Enables maximized readability, extensibility, maintainability and minimized complexity.

#### 1. The simplest example

Expected request:

```http
GET http://yourdomain.com/api/v1/user?id=12345
```

Using axios:

```javascript
import axios from 'axios'

// no need to explain that 'http://yourdomain.com/api/v1' is the base URL
const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// no need to explain that `/user` is the URL
const getUser = id => apiV1.get({ url: `/user`, params: { id } })

const response = await getUser(12345)
```

Using es-fetch-api, great readability:

```javascript
import { Fetcher, query } from "es-fetch-api";

const { getJSON } = new Fetcher('http://yourdomain.com/api/v1')

const getUser = id => getJSON('user', query({ id }))

const response = await getUser(12345)
```

#### 2. More complicated example (using built-in middlewares)

Expected request:

```
POST http://yourdomain.com/api/v1/user/
Content-Type: application/json

{"firstName":"Fred","lastName":"Flintstone"}
```

Using axios:

```javascript
import axios from 'axios'

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// which format is used to post data?
const createUser = user => apiV1.post(`/user`, user)

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

Using es-fetch-api, better readability:

```javascript
import { Fetcher, json, POST } from "es-fetch-api";

const { getJSON } = new Fetcher('http://yourdomain.com/api/v1')

// read exactly what you see
const createUser = user => getJSON('user', POST, json(user))

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

#### 3. Create custom middleware to extend your code while keeping better readability.

Expected request:

```
POST http://yourdomain.com/api/v1/user/
Content-Type: application/json
Authorization: Token ********
X-Timestamp: ##########

{"firstName":"Fred","lastName":"Flintstone"}
```

Using axios:

```javascript
import axios from 'axios'
import { getToken } from 'token-helper'

// easy to read? It is hard to tell that these functions return headers.
const useToken = async () => ({ 'Authorization': `Token ${await getToken()}` })
const useTimestamp = async () => ({ 'X-Timestamp': Date.now() })

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// easy to read? Maybe, but it is still too long-winded to maintain.
const createUser = async user => await apiV1.post({
    url: `/user`,
    data: user,
    headers: { ...await useToken(), ...await useTimestamp() }
})

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

Using es-fetch-api, better readability, better maintainability:

```javascript
import { Fetcher, json, POST } from "es-fetch-api";
import { getToken } from 'token-helper'

// read what you see
const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Token ${await getToken()}`)
    return next()
}
const useTimestamp = (ctx, next) => {
    ctx.header('X-Timestamp', Date.now())
    return next()
}

const { getJSON } = new Fetcher(
    'http://yourdomain.com/api/v1',
    useToken,
    useTimestamp
)

// read exactly what you see
const createUser = user => getJSON('user', POST, json(user))

const response = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

#### 4. Use custom middlewares for every invocation

Using axios:

```javascript
import axios from 'axios'
import { getToken } from 'token-helper'

const useToken = async () => ({ 'Authorization': `Token ${await getToken()}` })
const useTimestamp = () => ({ 'X-Timestamp': Date.now() })

// the headers are static here, especially X-Timestamp. Easy to maintain? No.
const apiV1 = axios.create({
    baseURL: 'http://yourdomain.com/api/v1',
    headers: { ...await useToken(), ...useTimestamp() }
})

const createUser = user => apiV1.post({ url: `/user`, data: user, })
const getUser = id => apiV1.get({ url: `/user`, params: { id } })

```

Using es-fetch-api, better readability, better maintainability:

```javascript
import { Fetcher, json, POST } from "es-fetch-api";
import { getToken } from 'token-helper'

const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Token ${await getToken()}`)
    return next()
}
const useTimestamp = (ctx, next) => {
    ctx.header('X-Timestamp', Date.now())
    return next()
}

const { getJSON } = new Fetcher(
    'http://yourdomain.com/api/v1',
    useToken,
    useTimestamp
)

const createUser = async user => await getJSON('user', POST, json(user))
```

#### 5. Process responses

For instance with the getUser function.

When the user exists, the response should be:

```text
Status: 200 OK
Content-Type: application/json
Body: {ok: true, data: {"firstName": "Chun", "lastName": "Li"}}
```

When the user does not exist, the response should be:

```text
Status: 404 NotFound
Content-Type: application/json
Body: {ok: false, message: 'User doesn't exist.'}
```

Using axios:

```javascript
import axios from 'axios'

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })
const getUser = async id => {
    try {
        const response = await apiV1.get({ url: `/user`, params: { id } })
        console.log(response.status, response.statusText)
        // response.data and error.response.data are easy to mix up
        const { data } = response.data
        return data
    } catch (error) {
        // which error object should I use here?
        console.log(error.response.data.message ?? error.message)
    }
}
```

Using es-fetch-api, great readability:

```javascript
import { Fetcher, query } from "es-fetch-api";

const { exec } = new Fetcher('http://yourdomain.com/api/v1')

const getUser = async id => {
    try {
        const response = await exec('user', query({ id }))
        console.log(response.status, response.statusText)
        const { ok, data, message } = await response.json() // read what you see
        if (!ok) throw { message }  // throw the error as you will
        return data
    } catch (error) {
        console.log(error.message)
    }
}
```

#### 6. Process responses in a unified way

Using axios:

```javascript
import axios from 'axios'

// can you understand it? 
// There seems no way to process errors in a unified way?
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

Using es-fetch-api, great readability:

```javascript
import { Fetcher, query } from "es-fetch-api";

const { exec } = new Fetcher('http://yourdomain.com/api/v1', useToken)
    .onError(error => {
        console.error(error)
    })

const getOne = async (...args) => {
    try {
        const response = await exec(...args)
        console.log(response.status, response.statusText)
        const { ok, data, message } = await response.json() // read what you see
        if (!ok) throw { message }  // throw the error as you will
        return data
    } catch (error) {
        console.log(error.message ?? error)
    }
}

const getUser = id => getOne('user', query({ id }))
```

### One word reason

In `es-fetch-api`, `Fetcher` gives you a small, readable surface on top of the same middleware chain. You can stay with
`getJSON()` / `getText()` / `getEvents().on()` for common cases, and drop down to `exec()` when you need full control.

## Built-in middlewares

Built-in middlewares are now exported from both `es-fetch-api` and `es-fetch-api/middlewares`, and the examples below use the package root as the default import entry.

### `method` middleware

This middleware sets the HTTP method. It accepts a string parameter for the method name. If an unsupported method name
is used, an exception will be thrown.

```javascript
import { Fetcher, method } from "es-fetch-api";

const { exec } = new Fetcher('http://mydomain.com/api')

const response = exec('/', method('DELETE'))
```

### `method` aliases

`GET`, `POST`, `PUT`, `PATCH` and `DELETE`, these are shorthands for each corresponding `method`.

```javascript
import { Fetcher, DELETE } from "es-fetch-api";

const { exec } = new Fetcher('http://mydomain.com/api')

const response = exec('/', DELETE)
```

### `json` middleware

This middleware declares that the HTTP request body is a JSON object.

It accepts an `Object` parameter as the request body.

When you use this middleware, the `Content-Type: application/json` header will be set automatically.

```javascript
import { Fetcher, json, POST } from "es-fetch-api";

const { exec } = new Fetcher('http://mydomain.com/api')

const response = exec('/', POST, json({ hello, world }))
```

### `query` middleware

This middleware declares the query string parameters of the request URL.

It accepts two parameters.

1. an `Object`, whose keys are query parameter names and whose values are the corresponding query parameter values.
   If a value is an array with more than one element, it becomes a multi-value parameter.
2. an options object: `{ append?, includeUndefined?, includeNull? }`

```javascript
import { Fetcher, query } from "es-fetch-api";

const { exec } = new Fetcher('http://mydomain.com/api?hello=1')

exec(query({ hello: 'world' })) // http://mydomain.com/api?hello=world
exec(query({ hello: 'world' }, { append: true })) // http://mydomain.com/api?hello=1&hello=world
exec(query({ hello: [ 'Bing', 'Dwen', 'Dwen' ], world: '2022' })) // http://mydomain.com/api?hello=Bing&hello=Dwen&hello=Dwen&world=2022
```

### `form` middleware

This middleware declares that the HTTP request body is form data.

It accepts an `Object` parameter as the form data.

When you use this middleware, the `Content-Type: application/x-www-form-urlencoded` header will be set automatically.

```javascript
import { Fetcher, form, POST } from "es-fetch-api";

const { exec } = new Fetcher('http://mydomain.com/api')

exec(POST, form({ hello: 'world' })) // hello=world
```

### `file` middleware

This middleware declares that the HTTP request uploads files.

It accepts three parameters:

1. the name of the `FormData` field that contains the file
2. a `File` object
3. an optional filename, which defaults to the original filename

### `abortable` middleware

This middleware injects AbortController::signal into fetch, so that you can abort the request as you wish.

You can use it to implement manual abort, timeout abort and so on.

When the AbortController::abort() is invoked, an exception will be thrown.

```javascript
import { Fetcher, abortable } from "es-fetch-api";

const { exec } = new Fetcher('http://mydomain.com/api')
const controller = new AbortController()
setTimeout(() => controller.abort(), 1000)
exec(abortable(controller))
```

## Middleware development

Each middleware follows the same signature (`Function` and `AsyncFunction` are both fine) and finally returns `next()`.

```javascript
const example = (ctx, next) => {
    // TODO: your logic
    return next()
}
```

or

```javascript
const example = async (ctx, next) => {
    // TODO: your logic
    return next()
}
```

### More about the `ctx`

`ctx` is almost the same as a [Request](https://fetch.spec.whatwg.org/#request-class), except that it exposes a helper
method for setting request headers. See the `useToken` middleware example in this document.

## License

[MIT](./LICENSE)

## Translations

- [Chinese](./README_CHS.md)
- [English](./README.md)
