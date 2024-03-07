import { useEffect, useState } from 'react';
import { fetcher } from '../fetcher';

export function useFetch<T>(...[url, options]: Parameters<typeof fetcher>): {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
} {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetcher(url, options);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data: T = await response.json();
        setData(data);
        setError(undefined);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Unknown error occurred'));
        }
        setData(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, error, isLoading };
}
