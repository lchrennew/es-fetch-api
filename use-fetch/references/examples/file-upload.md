# File Upload

文件上传示例，包括基础上传和附加元数据的场景。

## 基础文件上传

```javascript
import { getApi, file } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')

export const uploadAvatar = avatarFile => 
    api('users/avatar', file('avatar', avatarFile))
```

## 文件上传并附加元数据

```javascript
import { getApi, file } from 'es-fetch-api'

const api = getApi('https://example.com/api/v1')

export const uploadWithMetadata = (imageFile, metadata) => 
    api('uploads', [
        ...file('image', imageFile),
        (ctx, next) => {
            ctx.body.append('metadata', JSON.stringify(metadata))
            return next()
        }
    ])
```

注意：
- `file()` 返回的是中间件数组，已内置 `POST`
- 可以通过自定义中间件向 `ctx.body`（FormData）追加更多字段
