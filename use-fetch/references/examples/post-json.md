# POST JSON

POST 请求发送 JSON 数据的示例。

```javascript
import { getApi, POST, PUT, json } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')

export const createUser = payload => api('users', POST, json(payload))
export const updateUser = (id, payload) => api(`users/${id}`, PUT, json(payload))
```

注意：
- `json()` 只设置 `Content-Type` 和序列化请求体
- HTTP 方法需要显式传入 `POST`、`PUT` 或 `PATCH`
