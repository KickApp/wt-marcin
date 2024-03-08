import { createElement } from 'react';
import { ScreenName, useAppStore } from '../hooks/useAppStore';
import { Login } from './Login/Login';
import { TokenExchange } from './TokenExchange';
import { TransactionFeed } from './TransactionFeed';
import { TransactionDetails } from './TransactionDetails';

export function App() {
  const screeName = useAppStore((store) => store.screeName);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 max-w-2xl space-y-4">
        {createElement(screens[screeName])}
      </div>
    </div>
  );
}

const screens: Record<ScreenName, React.FunctionComponent> = {
  Login,
  TokenExchange,
  TransactionFeed,
  TransactionDetails,
};
