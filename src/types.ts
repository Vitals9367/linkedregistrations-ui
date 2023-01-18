import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export type Language = 'en' | 'fi' | 'sv';

export type Error<T> = {
  key: string;
} & T;

export type OptionType = {
  label: string;
  value: string;
};

export type LEServerError =
  | string
  | Record<string, unknown>
  | Array<Record<string, unknown> | string>;

export type ServerErrorItem = {
  label: string;
  message: string;
};

export type FalsyType = false | null | undefined | '' | 0;

type SessionExtensions = {
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  apiToken: string | null;
  apiTokenExpiresAt: number | null;
  sub: string | null;
};

export type ExtendedSession = Session & SessionExtensions;
export type ExtendedJWT = JWT & Omit<SessionExtensions, 'sub'>;
