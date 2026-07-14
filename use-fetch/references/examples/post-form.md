# POST Form

POST 请求发送表单数据的示例。

```javascript
import { Fetcher, POST, form } from 'es-fetch-api'

const { getJSON } = new Fetcher('https://example.com/api/v1')

export const login = (username, password) =>
    getJSON('login', POST, form({ username, password }))
```

`form()` 中间件会：
- 设置 `Content-Type: application/x-www-form-urlencoded`
- 将对象编码为 `URLSearchParams` 格式
