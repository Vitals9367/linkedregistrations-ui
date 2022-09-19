import Oidc, { UserManager, UserManagerSettings } from 'oidc-client';

import isClient from '../../utils/isClient';
import { ROUTES } from '../app/routes/constants';
import { createUserManager } from './utils';

const origin = isClient ? window.location.origin : '';

const enableOidcLogging = () => {
  Oidc.Log.logger = console;
  // Oidc.Log.level = Oidc.Log.DEBUG;
};

if (process.env.NODE_ENV === 'development') {
  enableOidcLogging();
}

const settings: UserManagerSettings = {
  authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
  automaticSilentRenew: true,
  client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
  redirect_uri: `${origin}${ROUTES.CALLBACK}`,
  loadUserInfo: true,
  response_type: 'id_token token',
  silent_redirect_uri: `${origin}${ROUTES.SILENT_CALLBACK}`,
  scope: `openid profile email ${process.env.NEXT_PUBLIC_OIDC_API_SCOPE}`,
  post_logout_redirect_uri: `${origin}${ROUTES.LOGOUT}`,
};

const userManager = createUserManager(settings) as UserManager;

export default userManager;
