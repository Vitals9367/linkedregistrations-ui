import { useRouter } from 'next/router';
import { User } from 'oidc-client';
import React from 'react';

import CallbackComponent from '../callbackComponent/CallbackComponent';
import userManager from '../userManager';

const OidcCallback: React.FC = () => {
  const router = useRouter();

  const onSuccess = (user: User) => {
    router.replace(user.state.path);
  };

  const onError = () => {
    if (
      new URLSearchParams(window.location.hash.replace('#', '?')).get('error')
    ) {
      router.replace('/');
    }
  };

  return (
    <CallbackComponent
      successCallback={onSuccess}
      errorCallback={onError}
      userManager={userManager}
    />
  );
};

export default OidcCallback;
