import type { AxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";

import type {
  AxiosInterceptorManagerUseParameters,
  AxiosInterceptorRejectedFuncType,
} from "./type";

export type RetryRequestConfig = {
  /** number of retries */
  retry?: number | null;
  /**
   * millisecond of retry delay
   * @default 1000
   */
  retryDelay?: number;
};

export type _RetryAxiosRequestConfig<D = any> = AxiosRequestConfig<D> &
  RetryRequestConfig;

export const onRetryInterceptorRejected: AxiosInterceptorRejectedFuncType = (
  error,
) => {
  if (!error) {
    return;
  }

  const { code, config: _config, message } = error as AxiosError;
  const config = _config as _RetryAxiosRequestConfig;
  if (!config || !config.retry) {
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

  config.retry -= 1;
  const delayRetryRequest = new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, config.retryDelay || 1000);
  });
  return delayRetryRequest.then(() => axios(config));
};

const _arr = [
  null,
  onRetryInterceptorRejected,
] as AxiosInterceptorManagerUseParameters;

export default _arr;
