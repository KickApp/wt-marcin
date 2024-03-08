const SESSION_ID_HEADER_NAME = 'X-Session-ID';

interface ExtraOptions {
  postData?: Record<string, undefined | string>;
}

let sessionId: null | string = null;

export async function fetcher(
  input: string,
  initWithExtraOptions: RequestInit & ExtraOptions = {}
): Promise<Response> {
  const init: RequestInit = extraOptionsReducers.reduce(
    (acc, reducer) => reducer(acc) ?? acc,
    initWithExtraOptions
  );
  const response = await fetch(`${baseUrl}${input}`, {
    ...init,
    headers: {
      ...init.headers,
      ...(sessionId && {
        [SESSION_ID_HEADER_NAME]: sessionId,
      }),
    },
  });
  sessionId =
    sessionId ??
    response.headers.get(SESSION_ID_HEADER_NAME) ??
    response.headers.get('X-Session-Id');
  return response;
}

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
