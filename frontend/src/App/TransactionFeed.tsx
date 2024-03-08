import { type AccountBase, type Transaction } from 'plaid';
import React, { useCallback } from 'react';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useGetAccounts } from '../hooks/useGetAccounts';
import { useGetItem } from '../hooks/useGetItem';
import { useSyncTransactions } from '../hooks/useSyncTransactions';

export const TransactionFeed: React.FC = () => {
  const syncTransactions = useSyncTransactions();
  const getAccounts = useGetAccounts();
  const getItem = useGetItem();

  const onRefresh = useCallback(() => {
    syncTransactions.mutate();
  }, [syncTransactions]);

  const onLoadMore = useCallback(() => {
    syncTransactions.setSize(syncTransactions.size + 1);
  }, [syncTransactions]);

  if (
    syncTransactions.isLoading ||
    getAccounts.isLoading ||
    getItem.isLoading
  ) {
    return <LoadingSpinner />;
  }

  if (!syncTransactions.data || !getAccounts.data || !getItem.data) {
    return <div>failed to load</div>;
  }

  const { accounts } = getAccounts.data;
  const { institution } = getItem.data;
  const syncTransactionsData = syncTransactions.data.reduce((acc, page) => ({
    ...acc,
    added: [...acc.added, ...page.added],
  }));

  return (
    <div className="container mx-auto space-y-4">
      <div className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4">
        <div className="flex flex-col">
          <span className="font-bold text-xl">{institution.name}</span>
          <span className="text-sm text-gray-500">
            {[
              `${accounts.length} linked account`,
              accounts.length !== 1 ? 's' : '',
            ].join('')}
          </span>
        </div>
        <Button onClick={onRefresh} className="font-normal">
          Refresh transactions
        </Button>
      </div>
      <ul className="space-y-4">
        {syncTransactionsData.added.map((transaction) => {
          const [account] = accounts.filter(
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
      {/* TODO: detect scroll past the end of the screen automatically */}
      <Button onClick={onLoadMore} className="font-normal w-full">
        Load more
      </Button>
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
