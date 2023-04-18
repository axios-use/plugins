import type {
  AxiosInterceptorManager,
  AxiosInterceptorOptions,
  AxiosResponse,
} from "axios";

export type AxiosInterceptorManagerUseParameters<V = AxiosResponse> =
  Parameters<AxiosInterceptorManager<V>["use"]>;

export type AxiosInterceptorFulfilledFuncType = NonNullable<
  AxiosInterceptorManagerUseParameters[0]
>;
export type AxiosInterceptorRejectedFuncType = NonNullable<
  AxiosInterceptorManagerUseParameters[1]
>;

export type AxiosInterceptorOptionsType = AxiosInterceptorOptions;
