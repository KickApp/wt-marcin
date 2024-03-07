import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Title } from '../../components/Title';
import { useCreateLinkToken } from '../../hooks/useCreateLinkToken';
import { PlaidLinkButton } from './PlaidLinkButton';

export function LoginScreen() {
  const createdLinkToken = useCreateLinkToken();

  if (createdLinkToken.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Title />
      <PlaidLinkButton linkToken={createdLinkToken.data!.link_token} />
    </>
  );
}
