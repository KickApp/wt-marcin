import { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { TransactionFeed } from './TransactionFeed';
import { useCreateLinkToken } from './hooks/useCreateLinkToken';

export function App() {
  const createdLinkToken = useCreateLinkToken();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Transaction Feed
        </h1>
        {createdLinkToken.isLoading ? (
          <LoadingSpinner />
        ) : (
          <PlaidLinkButton linkToken={createdLinkToken.data!.link_token} />
        )}
        <TransactionFeed />
      </div>
    </div>
  );
}

function PlaidLinkButton({ linkToken }: { linkToken: string }) {
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

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}
