import type { AxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";

import type {
  AxiosInterceptorManagerUseParameters,
  AxiosInterceptorRejectedFuncType,
} from "./type";

export type _RetryRequestConfig<K1 extends string, K2 extends string> = {
  [k in K1 | K2]?: number | null;
};

export const _getOnRejected: <K1 extends string, K2 extends string>(
  keys: [K1, K2],
) => AxiosInterceptorRejectedFuncType = (keys) => (error) => {
  if (!error) {
    return;
  }

  const [k1, k2] = keys;
  const { code, config: _config, message } = error as AxiosError;
  const config = _config as any;
  if (!config || !config[k1] || !(config[k1] && config[k1] > 0)) {
    return Promise.reject(error);
  }

  if (
    !(
      message.includes("timeout") ||
      message.includes("Network Error") ||
      !![AxiosError.ERR_NETWORK, AxiosError.ETIMEDOUT].find((c) => c === code)
    )
  ) {
    return Promise.reject(error);
  }

  config[k1] -= 1;
  const delayRetryRequest = new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, config[k2] || 1000);
  });
  return delayRetryRequest.then(() => axios(config));
};

/**
 * @retry number of retries
 * @retryDelay millisecond of retry delay
 */
export type RetryRequestConfig = _RetryRequestConfig<"retry", "retryDelay">;

export const onRetryInterceptorRejected = _getOnRejected([
  "retry",
  "retryDelay",
]);

const _arr = [
  null,
  onRetryInterceptorRejected,
] as AxiosInterceptorManagerUseParameters;

export default _arr;
