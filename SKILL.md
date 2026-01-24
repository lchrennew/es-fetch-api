---
name: es-fetch-api
description: Guide for installing and using the es-fetch-api library to make HTTP requests.
---

# es-fetch-api

This skill provides instructions and examples for using the `es-fetch-api` library.

## Installation

To use `es-fetch-api` in a project, first install it via npm:

```bash
npm install es-fetch-api
```

## Overview

`es-fetch-api` is a lightweight, middleware-based wrapper around the native `fetch` API. It allows you to compose requests using a chain of middlewares for handling query parameters, request bodies, headers, and more.

## Usage

### 1. Initialize API Client

Use `getApi` to create an API client instance with a base URL.

```javascript
import { getApi } from 'es-fetch-api';

const api = getApi('https://api.example.com');
```

### 2. Making Requests

The `api` function takes an endpoint path and a variable number of middlewares.

#### GET Request with Query Parameters

Use the `query` middleware to handle URL search parameters.

```javascript
import { query } from 'es-fetch-api/middlewares/query.js';

// GET https://api.example.com/users?page=1&limit=10
await api('/users', query({ page: 1, limit: 10 }));
```

#### POST JSON Request

Use the `json` middleware to send a JSON body. This automatically sets the `Content-Type: application/json` header.

```javascript
import { json } from 'es-fetch-api/middlewares/body.js';

// POST https://api.example.com/users
await api('/users', json({ name: 'Alice', age: 30 }));
```

#### POST Form Data

Use the `form` middleware to send `application/x-www-form-urlencoded` data.

```javascript
import { form } from 'es-fetch-api/middlewares/body.js';

// POST https://api.example.com/login
await api('/login', form({ username: 'user', password: 'pass' }));
```

#### File Upload (Multipart)

Use the `file` middleware to upload files. This uses `FormData` internally.

```javascript
import { file } from 'es-fetch-api/middlewares/body.js';

// POST https://api.example.com/upload
// Assuming `avatarBlob` is a Blob or File object
await api('/upload', file('avatar', avatarBlob, 'avatar.png'));
```

#### Custom Headers

Use the `header` middleware to set request headers.

```javascript
import { header } from 'es-fetch-api/middlewares/header.js';

await api('/protected', header({ 'Authorization': 'Bearer token' }));
```

#### Explicit HTTP Methods

By default, the method is inferred or defaults to GET. You can enforce a method using method middlewares.

```javascript
import { DELETE, PUT } from 'es-fetch-api/middlewares/methods.js';

// DELETE https://api.example.com/users/123
await api('/users/123', DELETE);

// PUT https://api.example.com/users/123
await api('/users/123', PUT, json({ name: 'Bob' }));
```

#### Abortable Requests

Use the `abortable` middleware with an `AbortController` to cancel requests.

```javascript
import { abortable } from 'es-fetch-api/middlewares/abortable.js';

const controller = new AbortController();
// Request will be aborted when controller.abort() is called
await api('/long-task', abortable(controller));

// To cancel:
// controller.abort();
```

## Best Practices

- Always use the provided middlewares (`json`, `query`, etc.) instead of manually constructing bodies or query strings.
- Import only the middlewares you need to keep the bundle size small.
- Use `getApi` to create a reusable client instance for your API's base URL.
