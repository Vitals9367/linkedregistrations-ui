/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRouter } from 'next/router';
import { User, UserManager } from 'oidc-client';
import React from 'react';

import CallbackComponent from '../callbackComponent/CallbackComponent';
import userManager from '../userManager';

const OidcCallback: React.FC = () => {
  const router = useRouter();

  const onSuccess = (user: User) => {
    router.replace(user.state.path || '/');
  };

  const onError = () => {
    // In case used denies the access
    router.replace('/');
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
