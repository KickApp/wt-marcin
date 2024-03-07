import { LoginScreen } from './LoginScreen/LoginScreen';
import { TransactionFeed } from './LoginScreen/TransactionFeed';

export function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 max-w-2xl space-y-4">
        <LoginScreen />
        <TransactionFeed />
      </div>
    </div>
  );
}
