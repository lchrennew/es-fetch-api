# GET with Query Parameters

基础的 GET 请求示例，使用 `query()` 中间件传递查询参数。

```javascript
import { Fetcher, query } from 'es-fetch-api'

const { getJSON } = new Fetcher('https://example.com/api/v1')

export const getUser = id => getJSON('users/detail', query({ id }))
export const listUsers = (page, size) => getJSON('users', query({ page, size }))
```
