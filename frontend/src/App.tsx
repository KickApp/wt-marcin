import { TransactionFeed } from './TransactionFeed';

export function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Transaction Feed
        </h1>
        <TransactionFeed />
      </div>
    </div>
  );
}
