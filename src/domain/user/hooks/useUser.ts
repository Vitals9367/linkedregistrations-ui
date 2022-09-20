import useDebounce from '../../../hooks/useDebounce';
import { useAuth } from '../../auth/hooks/useAuth';
import { useUserQuery } from '../query';
import { User } from '../types';

const LOADING_USER_DEBOUNCE_TIME = 50;

export type UserState = {
  loading: boolean;
  user?: User;
};

const useUser = (): UserState => {
  const { apiToken, isLoading: loadingTokens, user: oidcUser } = useAuth();
  const username = oidcUser?.profile.sub;

  const {
    data: user,
    isFetching: isFetchingUser,
    status: statusUser,
  } = useUserQuery(
    { username: username as string },
    { enabled: !!username && !!apiToken }
  );

  const loadingUser = statusUser === 'loading' && isFetchingUser;

  const loading = useDebounce(
    loadingUser || loadingTokens,
    LOADING_USER_DEBOUNCE_TIME
  );

  return { loading, user };
};

export default useUser;
