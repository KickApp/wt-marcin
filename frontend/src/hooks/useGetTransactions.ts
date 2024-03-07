import type { Transaction } from 'plaid';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

const url: string = '/api/transactions';

export function useGetTransactions() {
  return {
    ...useSWR<{ latest_transactions: Transaction[] }>(url),
    mutate: useCallback(() => mutate(url), []),
  };
}
