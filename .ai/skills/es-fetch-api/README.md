# AI Skills for es-fetch-api

This directory contains skills and examples to help AI agents understand and use the `es-fetch-api` library.

## Library Overview
`es-fetch-api` is a lightweight, middleware-based HTTP client wrapper around the native `fetch` API. It allows chaining middlewares to handle request configuration like query parameters, JSON bodies, headers, and more.

## Usage Pattern
The core function is `getApi(baseUrl)`, which returns a request function.
The request function takes an endpoint and a variable number of middleware functions.

## Examples

### 1. Basic Setup
```javascript
import { getApi } from 'es-fetch-api';
const api = getApi('https://api.example.com');
```

### 2. Query Parameters
```javascript
import { query } from 'es-fetch-api/middlewares/query.js';
await api('/search', query({ q: 'hello', page: 1 }));
```

### 3. JSON Body (POST)
```javascript
import { json } from 'es-fetch-api/middlewares/body.js';
await api('/users', json({ name: 'John' }));
```

### 4. Custom Headers
```javascript
import { header } from 'es-fetch-api/middlewares/header.js';
await api('/profile', header({ 'Authorization': 'Bearer token' }));
```

### 5. HTTP Methods
By default, `es-fetch-api` infers the method or defaults to GET. You can explicitly set it.
```javascript
import { DELETE, PUT } from 'es-fetch-api/middlewares/methods.js';
await api('/users/1', DELETE);
```

### 6. Aborting Requests
```javascript
import { abortable } from 'es-fetch-api/middlewares/abortable.js';
const controller = new AbortController();
api('/stream', abortable(controller));
controller.abort();
```
