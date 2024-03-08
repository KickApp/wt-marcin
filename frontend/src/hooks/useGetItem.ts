import type { Institution, Item } from 'plaid';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

const url: string = '/api/item';

export function useGetItem() {
  return {
    ...useSWR<{
      item: Item;
      institution: Institution;
    }>(url),
    mutate: useCallback(() => mutate(url), []),
  };
}
