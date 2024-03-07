import { SWRConfiguration } from 'swr';
import { fetcher } from './fetcher';

type Data = object;
type Error = object;

export const swrConfig: SWRConfiguration<Data, Error, typeof fetch> = {
  async fetcher(input, init) {
    const response = await fetcher(String(input), init);
    return response.json();
  },
};
