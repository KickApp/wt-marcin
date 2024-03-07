import { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export function PlaidLinkButton({ linkToken }: { linkToken: string }) {
  const { ready, open } = usePlaidLink({
    token: linkToken,
    onSuccess() {},
  });

  const onButtonClick = useCallback(() => {
    open();
  }, [open]);

  if (!ready) {
    return <LoadingSpinner />;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
      type="button"
      onClick={onButtonClick}
    >
      Login
    </button>
  );
}
