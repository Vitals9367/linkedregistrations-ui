/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable import/export */
import { ParsedUrlQuery } from 'querystring';

import {
  QueryClient,
  QueryClientProvider,
  QueryClientProviderProps,
} from '@tanstack/react-query';
import {
  act,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import { RequestHandler } from 'msw';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import React, { ReducerAction } from 'react';
import wait from 'waait';

import { testId } from '../common/components/loadingSpinner/LoadingSpinner';
import { AuthContext } from '../domain/auth/AuthContext';
import { AuthContextProps } from '../domain/auth/types';
import { server } from '../tests/msw/server';
import { authContextDefaultValue } from '../utils/mockAuthContextValue';

type CustomRenderOptions = {
  authContextValue?: AuthContextProps;
  path?: string;
  query?: ParsedUrlQuery;
  router?: Partial<NextRouter>;
};

type CustomRender = {
  (ui: React.ReactElement, options?: CustomRenderOptions): CustomRenderResult;
};

const customRender: CustomRender = (
  ui,
  {
    authContextValue = authContextDefaultValue,
    path = '/',
    query = {},
    router = {},
  } = {}
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
    },
  });

  const Wrapper: React.JSXElementConstructor<any> = ({ children }) => {
    return (
      <AuthContext.Provider value={authContextValue}>
        <RouterContext.Provider
          value={{
            ...mockRouter,
            ...router,
            ...(path ? { pathname: path, asPath: path, basePath: path } : {}),
            ...(query ? { query } : {}),
          }}
        >
          <QueryClientProvider client={queryClient}>
            {children as React.ReactElement}
          </QueryClientProvider>
        </RouterContext.Provider>
      </AuthContext.Provider>
    );
  };

  const renderResult = render(ui, { wrapper: Wrapper });
  return { ...renderResult };
};
const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  back: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

const setQueryMocks = (...handlers: RequestHandler[]): void => {
  server.use(...handlers);
};

const getQueryWrapper = (): React.JSXElementConstructor<any> => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper: React.FC<
    React.PropsWithChildren<QueryClientProviderProps>
  > = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return wrapper;
};

type CustomRenderResult = RenderResult;

const actWait = (amount?: number): Promise<void> => act(() => wait(amount));

const loadingSpinnerIsNotInDocument = async (timeout = 1000): Promise<void> =>
  waitFor(() => expect(screen.queryAllByTestId(testId)).toHaveLength(0), {
    timeout,
  });

const waitReducerToBeCalled = async (
  dispatch: jest.SpyInstance,
  action: ReducerAction<any>
) => await waitFor(() => expect(dispatch).toBeCalledWith(action));

export {
  actWait,
  CustomRenderOptions,
  customRender as render,
  getQueryWrapper,
  loadingSpinnerIsNotInDocument,
  setQueryMocks,
  waitReducerToBeCalled,
};

// re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
