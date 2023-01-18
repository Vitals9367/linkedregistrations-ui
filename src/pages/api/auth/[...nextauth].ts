import { NextApiRequest, NextApiResponse } from 'next';
import absoluteUrl from 'next-absolute-url';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers/oauth';

import {
  fetchApiToken,
  getApiTokenExpirationTime,
  isApiTokenExpiring,
} from '../../../domain/auth/utils';
import { ExtendedJWT, ExtendedSession } from '../../../types';

type User = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  nonce: string;
  at_hash: string;
  name: string;
  given_name: string;
  family_name: string;
  nickname: string;
  email: string;
  email_verified: boolean;
  azp: string;
  sid: string;
  amr: string;
  loa: string;
};

export const getNextAuthOptions = (req: NextApiRequest) => {
  const { origin } = absoluteUrl(req);
  const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: [
      {
        id: 'tunnistamo',
        name: 'Tunnistamo',
        type: 'oauth',
        wellKnown: `${process.env.NEXT_PUBLIC_OIDC_AUTHORITY}/.well-known/openid-configuration`,
        authorization: {
          params: {
            redirect_uri: `${origin}/callback`,
            scope: `openid profile email ${process.env.NEXT_PUBLIC_OIDC_API_SCOPE}`,
          },
        },
        client: {
          response_types: ['id_token token'],
        },
        checks: ['nonce', 'state'],
        idToken: true,
        clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
        profile(user) {
          return {
            id: user.sub,
            name: user.name,
            email: user.email,
          };
        },
      } as OAuthConfig<User>,
    ],
    callbacks: {
      async jwt({ token, account }) {
        const extendedToken = token as ExtendedJWT;

        if (account) {
          extendedToken.accessToken = account.access_token ?? null;
          extendedToken.accessTokenExpiresAt = account.expires_at ?? null;
        }

        if (extendedToken.accessToken) {
          if (
            !extendedToken.apiTokenExpiresAt ||
            isApiTokenExpiring(extendedToken.apiTokenExpiresAt)
          ) {
            try {
              const apiToken = await fetchApiToken({
                accessToken: extendedToken.accessToken,
              });

              extendedToken.apiToken = apiToken;
              extendedToken.apiTokenExpiresAt = getApiTokenExpirationTime();
            } catch (e) {
              extendedToken.apiToken = null;
              extendedToken.apiTokenExpiresAt = null;
            }
          }
        } else {
          extendedToken.apiToken = null;
          extendedToken.apiTokenExpiresAt = null;
        }

        return extendedToken;
      },
      async session({ session, token }) {
        const extendedSession = session as ExtendedSession;
        const {
          accessToken,
          accessTokenExpiresAt,
          apiToken,
          apiTokenExpiresAt,
          sub,
        } = token as ExtendedJWT;

        extendedSession.accessToken = accessToken;
        extendedSession.accessTokenExpiresAt = accessTokenExpiresAt;
        extendedSession.apiToken = apiToken;
        extendedSession.apiTokenExpiresAt = apiTokenExpiresAt;
        extendedSession.sub = sub ?? null;

        if (session.user && !session.user?.image) {
          session.user.image = null;
        }

        return session;
      },
    },
  };

  return authOptions;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, getNextAuthOptions(req));
}
