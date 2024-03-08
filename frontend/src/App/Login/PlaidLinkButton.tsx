import { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAppStore } from '../../hooks/useAppStore';

export function PlaidLinkButton({ linkToken }: { linkToken: string }) {
  const appStore = useAppStore();

  const { ready, open } = usePlaidLink({
    token: linkToken,
    onSuccess: appStore.setPublicToken,
  });

  const onButtonClick = useCallback(() => {
    open();
  }, [open]);

  if (!ready) {
    return <LoadingSpinner />;
  }

  return (
    <Button onClick={onButtonClick} className="w-full font-normal">
      Connect your account via Plaid
    </Button>
  );
}
