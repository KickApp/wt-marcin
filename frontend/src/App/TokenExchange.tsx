import { useEffect } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Title } from '../components/Title';
import { useAppStore } from '../hooks/useAppStore';
import { useExchangePublicToken } from '../hooks/useExchangePublicToken';

export const TokenExchange: React.FC = () => {
  const showTransactions = useAppStore((store) => store.showTransactions);
  const { data, isLoading } = useExchangePublicToken();

  useEffect(() => {
    if (data) {
      showTransactions();
    }
  }, [data, showTransactions]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Title />
      Token exchange
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};
