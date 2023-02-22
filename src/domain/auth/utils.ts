/* eslint-disable no-console */
import axios from 'axios';

import { APITokens, ExtendedSession, RefreshTokenResponse } from '../../types';
import { User } from '../user/types';

export const getApiTokensRequest = async ({
  accessToken,
  linkedEventsApiScope,
  url,
}: {
  accessToken: string;
  linkedEventsApiScope: string;
  url: string;
}): Promise<APITokens> => {
  const response = await axios.request({
    url,
    method: 'POST',
    responseType: 'json',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const linkedevents = response.data[linkedEventsApiScope];

  return { linkedevents };
};

export const refreshAccessTokenRequest = async ({
  clientId,
  clientSecret,
  refreshToken,
  url,
}: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  url: string;
}): Promise<RefreshTokenResponse> => {
  const response = await axios.request({
    url,
    method: 'POST',
    responseType: 'json',
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export const getUserName = ({
  session,
  user,
}: {
  session: ExtendedSession | null;
  user: User | undefined;
}): string => user?.display_name || session?.user?.email || '';
