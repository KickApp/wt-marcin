import { useFetch } from './useFetch';

interface LinkToken {
  readonly expiration: string;
  readonly link_token: string;
  readonly request_id: string;
}

export function useCreateLinkToken() {
  return useFetch<LinkToken>(`/api/create_link_token`, {
    method: 'POST',
  });
}
