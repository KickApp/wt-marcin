interface ExtraOptions {
  postData?: Record<string, undefined | string>;
}

export const fetcher = (
  input: string,
  initWithExtraOptions: RequestInit & ExtraOptions = {}
): Promise<Response> => {
  const init: RequestInit = extraOptionsReducers.reduce(
    (acc, reducer) => reducer(acc) ?? acc,
    initWithExtraOptions
  );
  return fetch(`${baseUrl}${input}`, init);
};

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

const extraOptionsReducers: ((
  init: RequestInit & ExtraOptions
) => undefined | RequestInit)[] = [
  ({ postData, ...init }) =>
    postData && {
      method: 'POST',
      headers: {
        ...init.headers,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams(
        Object.assign(
          {},
          ...Object.entries(postData).map(
            ([key, value]) => value && { [key]: String(value) }
          )
        )
      ).toString(),
      ...init,
    },
];
