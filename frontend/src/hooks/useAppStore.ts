import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  screeName: ScreenName;
  publicToken?: string;
  publicTokenMetadata?: PlaidLinkOnSuccessMetadata;
  setPublicToken(
    token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ): Promise<void>;
  showTransactions(): void;
}

const initialState: NonFunctionProperties<AppState> = {
  screeName: 'Login',
};

export const screenNames = [
  'Login',
  'TokenExchange',
  'TransactionFeed',
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
    };
  })
);

type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
