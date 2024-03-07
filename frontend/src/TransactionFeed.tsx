import React from 'react';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';

// Define TypeScript interface for transaction
interface Transaction {
  id: number;
  icon: string; // URL to the transaction's icon
  description: string;
  datetime: string;
  amount: string;
  accountName: string;
}

// Mock data for transactions
const transactions: Transaction[] = [
  {
    id: 1,
    icon: viteLogo,
    description: 'Coffee Shop',
    datetime: '2024-03-07T09:00:00Z',
    amount: '$5.75',
    accountName: 'Visa Credit Card',
  },
  {
    id: 2,
    icon: reactLogo,
    description: 'Book Store',
    datetime: '2024-03-06T14:20:00Z',
    amount: '$23.90',
    accountName: 'Visa Credit Card',
  },
  {
    id: 3,
    icon: reactLogo,
    description: 'Grocery Store',
    datetime: '2024-03-05T17:45:00Z',
    amount: '$76.43',
    accountName: 'Visa Credit Card',
  },
  {
    id: 4,
    icon: viteLogo,
    description: 'Online Subscription',
    datetime: '2024-03-04T12:00:00Z',
    amount: '$9.99',
    accountName: 'Visa Credit Card',
  },
  {
    id: 5,
    icon: reactLogo,
    description: 'Gas Station',
    datetime: '2024-03-03T08:30:00Z',
    amount: '$45.67',
    accountName: 'Visa Credit Card',
  },
];

export const TransactionFeed: React.FC = () => {
  return (
    <div className="container mx-auto">
      <ul className="space-y-4">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={transaction.icon}
                alt="Transaction Icon"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-bold">{transaction.description}</span>
                <span className="text-sm text-gray-500">
                  {transaction.datetime}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold">
                {transaction.amount}
              </span>
              <span className="text-sm text-gray-500">
                {transaction.accountName}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
