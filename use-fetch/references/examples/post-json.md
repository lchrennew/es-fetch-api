# POST JSON

POST 请求发送 JSON 数据的示例。

```javascript
import { Fetcher, POST, PUT, json } from 'es-fetch-api'

const { getJSON } = new Fetcher('https://example.com/api/v1')

export const createUser = payload => getJSON('users', POST, json(payload))
export const updateUser = (id, payload) => getJSON(`users/${id}`, PUT, json(payload))
```

注意：
- `json()` 只设置 `Content-Type` 和序列化请求体
- HTTP 方法需要显式传入 `POST`、`PUT` 或 `PATCH`
