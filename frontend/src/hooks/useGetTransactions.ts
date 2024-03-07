import type { Transaction } from 'plaid';
import useSWR from 'swr';

export function useGetTransactions() {
  return useSWR<{ latest_transactions: Transaction[] }>('/api/transactions');
}
