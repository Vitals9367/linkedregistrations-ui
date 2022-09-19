/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, UserManager } from 'oidc-client';

import { ApiTokenActionTypes, OidcActionTypes } from './constants';

export interface AuthProviderProps {
  userManager: UserManager;
}

export interface OidcAction {
  type: OidcActionTypes;
  payload: User | null;
}

export interface OidcReducerState {
  isLoadingUser: boolean;
  user: User | null;
}

export interface ApiTokenAction {
  type: ApiTokenActionTypes;
  payload: any;
}

export type ApiTokenReducerState = {
  apiToken: string | null;
  tokenErrors: Record<string, unknown>;
  isLoadingApiToken: boolean;
};

export interface AuthContextActions {
  /**
   * Alias for userManager.signInRedirect
   */
  signIn: (path?: string) => Promise<void>;
  /**
   * Alias for userManager.signOutRedirect
   */
  signOut: () => Promise<void>;
}

export type AuthContextProps = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userManager: UserManager;
} & OidcReducerState &
  AuthContextActions &
  ApiTokenReducerState;
