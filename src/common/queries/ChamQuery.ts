import { QueryClient, type Updater, useQueries, useQuery, type UseQueryOptions, type UseQueryResult, useSuspenseQueries, type UseSuspenseQueryResult, type UseSuspenseQueryOptions } from "@tanstack/react-query";

export const chamQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

export type ChamPartialQueryKey<Params> = [...string[], Partial<Params>];
export type ChamQueryKey<Params> = [...string[], Params];
export type ChamQueryOptions<Params, Res, Error> = Omit<UseQueryOptions<Res, Error, Res, ChamQueryKey<Params>>, "queryKey">;

export interface ChamQuery<Params, Res, Error> {
  baseQueryKey: string[]
  getQueryKey: (params: Params) => ChamQueryKey<Params>
  getPartialQueryKey: (params: Partial<Params>) => ChamPartialQueryKey<Params>
  use: (params: Params, options?: ChamQueryOptions<Params, Res, Error>) => UseQueryResult<Res, Error>
  useAll: (params: Params[], options?: ChamQueryOptions<Params, Res, Error>) => Pick<UseQueryResult<Res[], Error>, "data" | "isLoading" | "isFetching" | "isError" | "isPending">
  useSuspenseAll: (params: Params[], options?: ChamQueryOptions<Params, Res, Error>) => Pick<UseSuspenseQueryResult<Res[], Error>, "data" | "isError">
  invalidate: (p?: Partial<Params>) => void
  refetch: (p?: Partial<Params>) => Promise<void>
  fetch: (p: Params, options?: ChamQueryOptions<Params, Res, Error>) => Promise<Res>
  get: (p: Params) => Res | undefined
  set: (p: Params, updater: Updater<Res | undefined, Res>) => void
}

export type ChamQueryParams<T> = T extends ChamQuery<infer P, unknown, unknown> ? P : never;

export const createChamQuery = <Params, Res, Error>(
  {
    baseQueryKey,
    options,
    onInvalidate,
    onSet,
  }: {
    baseQueryKey: string[]
    options: (params: Params) => ChamQueryOptions<Params, Res, Error>
    onInvalidate?: (p?: Partial<Params>) => void
    onSet?: (p: Params, data: Res) => void
  }) => {
  const getQueryKey = (params: Params) => [...baseQueryKey, params] as ChamQueryKey<Params>;
  const getPartialQueryKey = (params?: Partial<Params>) => [...baseQueryKey, params]
    .filter(x =>
      x !== undefined
      && ((typeof x === "object" && x !== null)
        ? Object.keys(x).length > 0
        : true),
    ) as ChamPartialQueryKey<Params>;
  const getOptions = (params: Params, overrideOptions?: ChamQueryOptions<Params, Res, Error>) => ({
    queryKey: getQueryKey(params),
    retryDelay: 3000,
    ...options(params),
    ...overrideOptions,
  });

  return ({
    baseQueryKey,
    getQueryKey,
    getPartialQueryKey,
    use: (params, options) => {
      return useQuery(getOptions(params, options));
    },
    useAll: (params: Params[], options) => {
      return useQueries({
        queries: params.map(p => getOptions(p, options)),
        combine: (results) => {
          return {
            data: results.map(r => r.data),
            isLoading: results.some(r => r.isLoading),
            isFetching: results.some(r => r.isFetching),
            isError: results.some(r => r.isError),
            isPending: results.some(r => r.isPending),
          };
        },
      });
    },
    useSuspenseAll: (params: Params[], options) => {
      return useSuspenseQueries({
        queries: params.map(p => getOptions(p, options)) as UseSuspenseQueryOptions<Res, Error, Res, ChamQueryKey<Params>>[],
        combine: (results) => {
          return {
            data: results.map(r => r.data),
            isError: results.some(r => r.isError),
          };
        },
      });
    },
    invalidate: (p) => {
      chamQueryClient.invalidateQueries({ queryKey: getPartialQueryKey(p) });
      onInvalidate?.(p);
    },
    refetch: (p) => {
      onInvalidate?.(p);
      return chamQueryClient.refetchQueries({
        queryKey: getPartialQueryKey(p),
      });
    },
    fetch: async (p, options) => {
      const data = await chamQueryClient.fetchQuery(getOptions(p, options));
      onSet?.(p, data);
      return data;
    },
    get: (p) => {
      return chamQueryClient.getQueryData(getQueryKey(p));
    },
    set: (p, updater) => {
      const data = chamQueryClient.setQueryData(getQueryKey(p), updater);
      onSet?.(p, data as Res);
      return data;
    },
  } as ChamQuery<Params, Res, Error>);
};
