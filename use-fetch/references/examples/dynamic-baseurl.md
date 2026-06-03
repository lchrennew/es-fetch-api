# Dynamic Base URL

基础地址从配置或环境变量动态获取的示例。

```javascript
import { getApi, query } from 'es-fetch-api'

// 基础地址从配置或环境变量动态获取
const api = getApi(async () => {
    const config = await fetchAppConfig()
    return config.apiBaseUrl
})

export const getUser = id => api('users/detail', query({ id }))
```

适用场景：
- 多环境切换（开发/测试/生产）
- 从远程配置中心获取 API 地址
- 根据用户租户动态切换后端域名
