import { useCallback } from 'react';
import { Button } from '../components/Button';
import { useAppStore } from '../hooks/useAppStore';

export const TransactionDetails: React.FC = () => {
  const selectedTransaction = useAppStore((store) => store.selectedTransaction);
  const showTransactions = useAppStore((store) => store.showTransactions);
  const onBackClick = useCallback(() => {
    showTransactions();
  }, [showTransactions]);

  if (!selectedTransaction) {
    return <></>;
  }

  return (
    <div className="container mx-auto space-y-4">
      <Button onClick={onBackClick} className="font-normal w-full">
        Back
      </Button>
      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-md p-4">
        <pre>{JSON.stringify(selectedTransaction, null, 2)}</pre>
      </div>
    </div>
  );
};
