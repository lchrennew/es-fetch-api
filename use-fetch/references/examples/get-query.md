# GET with Query Parameters

基础的 GET 请求示例，使用 `query()` 中间件传递查询参数。

```javascript
import { getApi, query } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')

export const getUser = id => api('users/detail', query({ id }))
export const listUsers = (page, size) => api('users', query({ page, size }))
```
