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
  if (previousPageData && !previousPageData.has_more) {
    return null;
  }

  if (pageIndex === 0) {
    return url;
  }

  return `${url}?cursor=${encodeURIComponent(previousPageData!.next_cursor)}`;
};
