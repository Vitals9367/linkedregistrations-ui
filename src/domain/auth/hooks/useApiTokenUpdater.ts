import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { ExtendedSession } from '../../../types';
import {
  clearApiTokenFromCookie,
  getApiTokenFromCookie,
  setApiTokenToCookie,
} from '../utils';

const useApiTokenUpdater = () => {
  const { data } = useSession();
  const session = data as ExtendedSession;

  useEffect(() => {
    if (session?.apiToken && session?.apiToken !== getApiTokenFromCookie()) {
      setApiTokenToCookie(session.apiToken as string);
    } else if (!session?.apiToken) {
      clearApiTokenFromCookie();
    }
  }, [session?.apiToken]);
};

export default useApiTokenUpdater;
