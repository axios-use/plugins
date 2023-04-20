# @axios-use/plugins

[![](https://img.shields.io/npm/v/@axios-use/plugins.svg)](https://www.npmjs.com/package/@axios-use/plugins)

Plugins for Axios

## Interceptors

### Retry

A Axios interceptor to retry requests. Intercept AxiosError code `ERR_NETWORK` and `ETIMEDOUT` report errors, try to retry again.

```js
import { retryInterceptorArgs } from "@axios-use/plugins";
// or
import retryInterceptorArgs from "@axios-use/plugins/retry";

axios.interceptors.response.use(...retryInterceptorArgs);
```

| config     | type   | default | explain                    |
| ---------- | ------ | ------- | -------------------------- |
| retry      | number | -       | number of retries          |
| retryDelay | number | 1000    | millisecond of retry delay |

```js
axios({
  method: "get",
  url: "/api/users",
  /** number of retries */
  retry: 1,
  /** millisecond of retry delay @default 1000 */
  retryDelay: 1200,
});
```

## License

[MIT](./LICENSE)
