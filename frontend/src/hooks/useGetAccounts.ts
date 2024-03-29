import type { AccountsGetResponse } from 'plaid';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

const url = '/api/accounts';

export function useGetAccounts() {
  return {
    ...useSWR<AccountsGetResponse>(url),
    mutate: useCallback(() => mutate(url), []),
  };
}
