# ES-Fetch-API
[中文](./README_CHS.md)  |  English

Very very very powerful, extensible http client for both node.js and browser.

![NPM](https://img.shields.io/npm/l/es-fetch-api)
![npm](https://img.shields.io/npm/v/es-fetch-api)
![GitHub package.json version](https://img.shields.io/github/package-json/v/lchrennew/es-fetch-api)
![GitHub file size in bytes](https://img.shields.io/github/size/lchrennew/es-fetch-api/fetch.js)
![GitHub issues](https://img.shields.io/github/issues-raw/lchrennew/es-fetch-api)
![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/lchrennew/es-fetch-api)

## Why should you use ES-Fetch API?

Still using `axios`? `ES-Fetch-API` creates sunny world for you.

### i. It's extremely light-weight and built on the native fetch API.

Comparing to axios which is ~400kB, `es-fetch-api` is just ~6kB. Because es-fetch-api is designed for native fetch API
compatible environments.

References:

1. [fetch API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#browser_compatibility)
2. [fetch API on whatwg.org](https://fetch.spec.whatwg.org/)

### ii. Enables maximized readability, extensibility, maintainability and minimized complexity.

#### 1. The simplest example

Expected request:

```http
GET http://yourdomain.com/api/v1/user?id=12345
```

Using axios:

```javascript
import axios from 'axios'

// unneccessarily indicate that 'http://yourdomain.com/api/v1' means baseURL
const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// unneccessarily indicate that `/user` means url
const getUser = async id => await apiV1.get({ url: `/user`, params: { id } })

const response = await getUser(12345)
```

Using es-fetch-api, great readability:

```javascript
import { getApi, query } from "es-fetch-api";

// without mincing words
const apiV1 = getApi('http://yourdomain.com/api/v1')

const getUser = async id => await apiV1(`user`, query({ id }))

const response = await getUser(12345)
```

#### 2. More complicated example (using built-in middlewares)

Expected request:

```http
POST http://yourdomain.com/api/v1/user/
Content-Type: application/json

{"firstName":"Fred","lastName":"Flintstone"}
```

Using axios:

```javascript
import axios from 'axios'

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// which format is used to post data?
const createUser = async user => await apiV1.post(`/user`, user)

const resposne = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

Using es-fetch-api, better readability:

```javascript
import { getApi, json, POST } from "es-fetch-api";

const apiV1 = getApi('http://yourdomain.com/api/v1')

// read what you see infomation losslessly 
const createUser = async user => await apiV1(`user`, POST, json(user))

const resposne = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

#### 3. Create custom middleware to extend your code while keeping better readability.

Expected request:

```http
POST http://yourdomain.com/api/v1/user/
Content-Type: application/json
Auhorization: Token ********
X-Timestamp: ##########

{"firstName":"Fred","lastName":"Flintstone"}
```

Using axios:

```javascript
import axios from 'axios'
import { getToken } from 'token-helper'

// easy to read? it's hard to understand they return headers.
const useToken = async () => ({ 'Authorization': `Token ${await getToken()}` })
const useTimestamp = async () => ({ 'X-Timestamp': Date.now() })

const apiV1 = axios.create({ baseURL: 'http://yourdomain.com/api/v1' })

// easy to read? Maybe or not, but too long winded to maintain.
const createUser = async user => await apiV1.post({
    url: `/user`,
    data: user,
    headers: { ...await useToken(), ...await useTimestamp() }
})

const resposne = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

Using es-fetch-api, better readability, better maintainability:

```javascript
import { getApi, json, POST } from "es-fetch-api";
import { getToken } from 'token-helper'

// read what you see
const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Token ${await getToken()}`)
    return await next()
}
const useTimestamp = async (ctx, next) => {
    ctx.header('X-Timestamp', Date.now())
    return await next()
}

const apiV1 = getApi('http://yourdomain.com/api/v1')

// read what you see infomation-losslessly 
const createUser = async user => await apiV1(`user`, POST, json(user), useToken, useTimestamp)

const resposne = await createUser({
    firstName: 'Chun',
    lastName: 'Li'
})
```

#### 4. To use custom middlewares for every invocation.

Using axios:

```javascript
import axios from 'axios'
import { getToken } from 'token-helper'

const useToken = async () => ({ 'Authorization': `Token ${await getToken()}` })
const useTimestamp = async () => ({ 'X-Timestamp': Date.now() })

// headers is static, especially the X-Timestamp. Easy to maintain? No!
const apiV1 = axios.create({
    baseURL: 'http://yourdomain.com/api/v1',
    headers: { ...await useToken(), ...await useTimestamp() }
})

const createUser = async user => await apiV1.post({ url: `/user`, data: user, })
const getUser = async id => await apiV1.get({ url: `/user`, params: { id } })

```

Using es-fetch-api, better readability, better maintainability:

```javascript
import { getApi, json, POST } from "es-fetch-api";
import { getToken } from 'token-helper'

const useToken = async (ctx, next) => {
    ctx.header('Authorization', `Token ${await getToken()}`)
    return await next()
}
const useTimestamp = async (ctx, next) => {
    ctx.header('X-Timestamp', Date.now())
    return await next()
}

// Just append the middlewares, so easy.
const apiV1 = (...args) => getApi('http://yourdomain.com/api/v1')(...args, useToken, useTimestamp)

const createUser = async user => await apiV1(`user`, POST, json(user))
```

#### 5. Process response.

For instance with the getUser function.

When the user exists, the response should be:

```text
Status: 200 OK
Content-Type: application/json
Body: {ok: true, data: {"firstName": "Chun", "lastName": "Li"}}
```

When the user doesn't exist, the resposne should be:

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
        // So many data and error, make me confused...don't forget write the .data after the response :)
        const { data } = response.data
        return data
    } catch (error) {
        // which error is the error i want to use?
        console.log(error.response.data.message ?? error.message)
    }
}
```

Using es-fetch-api, great readability:

```javascript
import { getApi, query } from "es-fetch-api";

const apiV1 = getApi('http://yourdomain.com/api/v1')

const getUser = async id => {
    try {
        const response = await apiV1(`user`, query({ id }))
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
        const resposne = await apiV1(config)
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
import { getApi, query } from "es-fetch-api";

const apiV1 = getApi('http://yourdomain.com/api/v1')

const getOne = async (...args) => {
    try {
        const resposne = await apiV1(...args, useToken) // you can append custom middlewares here.
        console.log(response.status, response.statusText)
        const { ok, data, message } = await response.json() // read what you see
        if (!ok) throw { message }  // throw the error as you will
        return data
    } catch (error) {
        console.log(error.message ?? error)
    }
}

// getOne is the unified way to process every response. You could also write other logics such as getList
// read what you see
const getUser = async id => getOne(`user`, query({ id }))
```

### One word reason

In es-fetch-api, each api invocation is a middlewares-chain, which means everything is extensible without introducing
more complexity, no matter you want to process request and response in any unified way or case by case.

## Built-in middlewares

### `method` middleware

This middleware is used to set HTTP method, it accepts a string parameter for method name to use. If an unsupported
method name is used, an exception will be thrown.

```javascript
import { getApi, method } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

const response = api('/', method('DELETE'))
```

### `method` aliases

`GET`, `POST`, `PUT`, `PATCH` and `DELETE`, these are shorthands for each corresponding `method`.

```javascript
import { getApi, DELETE } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

const response = api('/', DELETE)
```

### `json` middleware

This middleware is used to declare the HTTP request body is an JSON object.

It accepts an Object parameter to pass the body object in.

When you use this middleware, the `Content-Type: application/json` header will be set automatically.

```javascript
import { getApi, POST, json } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

const response = api('/', POST, json({ hello, world }))
```

### `query` middleware

This middleware is used to declare the query string parameters of the request URL.

It accepts two parameters.

1. an Object, whose keys are the query parameter names and their corresponding value(s) are the query parameter values.
   If a value is an array with more than one element, then it will be an multi-value parameter.
2. a Boolean, used to indicate whether each query parameter value should be appended to existed values. By Default,
   it's `false`.

```javascript
import { getApi, query } from "es-fetch-api";

const api = getApi('http://mydomain.com/api?hello=1')

api(query({ hello: 'world' })) // http://mydomain.com/api?hello=world
api(query({ hello: 'world' }, true)) // http://mydomain.com/api?hello=1&hello=world
api(query({ hello: [ 'Bing', 'Dwen', 'Dwen' ], world: '2022' })) // http://mydomain.com/api?hello=Bing&hello=Dwen&hello=Dwen&world=2022
```

### `form` middleware

This middleware is used to declare the HTTP request body is form data.

It accepts an Object parameter to pass form data in.

When you use this middleware, the `Content-Type: application/x-www-form-urlencoded` header will be set automatically.

```javascript
import { getApi, form } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')

api(POST, form({ hello: 'world' })) // hello=world
```

### `file` middleware

This middleware is used to declare the HTTP request is uploading files.

It accepts three parameters:

1. the name of FormData field contains the file
2. a `File` object
3. give a filename, by default it's the original filename

### `abortable` middleware

This middleware injects AbortController::signal into fetch, so that you can abort the request as you wish.

You can use it to implement manual abort, timeout abort and so on.

When the AbortController::abort() is invoked, an exception will be thrown.

```javascript
import { getApi, abortable } from "es-fetch-api";

const api = getApi('http://mydomain.com/api')
const controller = new AbortController()
setTimeout(() => controller.abort(), 1000)
api(abortable(controller))
```

## Middleware development

Each middleware MUST follow the same signature, finally `return await next()`.

```javascript
const example = async (ctx, next) => {
    // TODO: your logic
    return await next()
}
```

### More about the `ctx`

The `ctx` is completely same as the [Concept Request](https://fetch.spec.whatwg.org/#concept-request), except the `ctx`
exposes a helper method used to set request headers, see `useToken` middleware example in this document.

## License

[MIT](./LICENSE)

## Translations

- [Chinese](./README_CHS.md)
- [English](./README.md)
