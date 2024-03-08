import { Transaction } from 'plaid';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  screeName: ScreenName;
  publicToken?: string;
  publicTokenMetadata?: PlaidLinkOnSuccessMetadata;
  selectedTransaction?: Transaction;
  setPublicToken(
    token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ): Promise<void>;
  showTransactions(): void;
  showTransaction(transaction: Transaction): void;
}

const initialState: NonFunctionProperties<AppState> = {
  screeName: 'Login',
};

export const screenNames = [
  'Login',
  'TokenExchange',
  'TransactionFeed',
  'TransactionDetails',
] as const;
export type ScreenName = (typeof screenNames)[number];

export const useAppStore = create<AppState>()(
  devtools((set) => {
    function update(action: string, partial: Partial<AppState>) {
      set<string>(partial, false, action);
    }
    return {
      ...initialState,
      async setPublicToken(publicToken, publicTokenMetadata) {
        update('Set public token', {
          screeName: 'TokenExchange',
          publicToken,
          publicTokenMetadata,
        });
      },
      showTransactions() {
        update('Show transactions', {
          screeName: 'TransactionFeed',
        });
      },
      showTransaction(tx: Transaction) {
        update(`Set transaction ${tx.transaction_id}`, {
          screeName: 'TransactionDetails',
          selectedTransaction: tx,
        });
      },
    };
  })
);

type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
