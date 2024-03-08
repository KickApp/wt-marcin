import type { AccountBase, Transaction } from 'plaid';
import React, { useCallback } from 'react';
import { Button } from '../components/Button';
import { useGetAccounts } from '../hooks/useGetAccounts';
import { useGetItem } from '../hooks/useGetItem';
import { useGetTransactions } from '../hooks/useGetTransactions';

export const TransactionFeed: React.FC = () => {
  const getTransactions = useGetTransactions();
  const getAccounts = useGetAccounts();
  const getItem = useGetItem();

  const onRefresh = useCallback(() => {
    getTransactions.mutate();
  }, [getTransactions]);

  if (getTransactions.isLoading || getAccounts.isLoading || getItem.isLoading) {
    return <div>loading...</div>;
  }

  if (!getTransactions.data || !getAccounts.data || !getItem.data) {
    return <div>failed to load</div>;
  }

  const { institution } = getItem.data;

  return (
    <div className="container mx-auto space-y-4">
      <div className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4">
        <div className="text-xl">{institution.name}</div>
        <Button onClick={onRefresh} className="font-normal">
          Refresh transactions
        </Button>
      </div>
      <ul className="space-y-4">
        {getTransactions.data.latest_transactions.map((transaction) => {
          const [account] = getAccounts.data!.accounts.filter(
            (acc) => acc.account_id === transaction.account_id
          );
          return (
            <TransactionTile
              key={transaction.transaction_id}
              {...{ transaction, account }}
            />
          );
        })}
      </ul>
    </div>
  );
};

const TransactionTile: React.FC<{
  transaction: Transaction;
  account: AccountBase;
}> = ({ transaction: t, account }) => (
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
      <span className="text-sm text-gray-500">{account.name}</span>
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
