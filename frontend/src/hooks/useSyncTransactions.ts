import type { TransactionsSyncResponse } from 'plaid';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';

const url = '/api/transactions';

export function useSyncTransactions() {
  return useSWRInfinite<TransactionsSyncResponse>(getKey);
}

const getKey: SWRInfiniteKeyLoader<TransactionsSyncResponse> = (
  pageIndex,
  previousPageData
) => {
  if (!previousPageData || pageIndex === 0) {
    return url;
  }

  if (!previousPageData.has_more) {
    return null;
  }

  return `${url}?cursor=${encodeURIComponent(previousPageData.next_cursor)}`;
};
