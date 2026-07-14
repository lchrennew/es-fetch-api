# Abortable Request

可取消请求的示例，用于超时控制或用户主动取消。

```javascript
import { Fetcher, abortable, query } from 'es-fetch-api'

const { getJSON } = new Fetcher('https://example.com/api/v1')

export const searchUsers = (keyword, controller) =>
    getJSON('users/search', query({ keyword }), abortable(controller))
```

## 使用示例

```javascript
// 5 秒后自动取消
const controller = new AbortController()
setTimeout(() => controller.abort(), 5000)

try {
    const results = await searchUsers('john', controller)
    console.log(results)
} catch (error) {
    if (error.name === 'AbortError') {
        console.log('请求已取消')
    }
}
```

适用场景：
- 搜索输入防抖时取消旧请求
- 请求超时控制
- 页面卸载时取消未完成的请求
