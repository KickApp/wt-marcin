import { useAppStore } from './useAppStore';
import { useFetch } from './useFetch';

interface SessionInfo {
  readonly item_id: string;
}

export function useExchangePublicToken() {
  const publicToken = useAppStore((store) => store.publicToken);
  return useFetch<SessionInfo>(`/api/set_access_token`, {
    method: 'POST',
    postData: { public_token: publicToken },
  });
}
