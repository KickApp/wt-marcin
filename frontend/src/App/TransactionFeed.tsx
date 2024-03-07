import type { Transaction } from 'plaid';
import React from 'react';
import { useGetTransactions } from '../hooks/useGetTransactions';

export const TransactionFeed: React.FC = () => {
  const { data: transactions, error, isLoading } = useGetTransactions();

  if (isLoading) {
    return <div>loading...</div>;
  }
  if (error || !transactions) {
    return <div>failed to load</div>;
  }

  return (
    <div className="container mx-auto">
      <ul className="space-y-4">
        {transactions.latest_transactions.map((t) => (
          <TransactionTile key={t.transaction_id} transaction={t} />
        ))}
      </ul>
    </div>
  );
};

const TransactionTile: React.FC<{ transaction: Transaction }> = ({
  transaction: t,
}) => (
  <li
    key={t.transaction_id}
    className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4"
  >
    <div className="flex items-center space-x-4">
      <img
        src={t.logo_url ?? t.personal_finance_category_icon_url}
        alt="Transaction Icon"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-bold">{t.merchant_name ?? t.name}</span>
        <span className="text-sm text-gray-500">{t.datetime ?? t.date}</span>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-lg font-semibold">
        {formatCurrency(t.amount!, t.iso_currency_code)}
      </span>
      <span className="text-sm text-gray-500">
        Acc#{t.account_id.slice(0, 8)}
      </span>
    </div>
  </li>
);

function formatCurrency(
  number: number | null | undefined,
  code: string | null | undefined
) {
  if (number != null && number !== undefined) {
    return ` ${parseFloat(number.toFixed(2)).toLocaleString('en')} ${code}`;
  }
  return 'no data';
}
