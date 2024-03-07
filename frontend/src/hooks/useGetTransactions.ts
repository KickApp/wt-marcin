import type { Transaction } from 'plaid';
import useSWR, { mutate } from 'swr';

const url: string = '/api/transactions';

export function useGetTransactions() {
  return {
    ...useSWR<{ latest_transactions: Transaction[] }>(url),
    mutate: mutateTransacitons,
  };
}

const mutateTransacitons = () => mutate(url);
