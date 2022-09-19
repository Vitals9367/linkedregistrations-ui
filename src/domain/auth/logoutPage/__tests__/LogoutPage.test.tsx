/* eslint-disable @typescript-eslint/no-require-imports */
import mockRouter from 'next-router-mock';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  actWait,
  configure,
  render,
  screen,
} from '../../../../utils/testUtils';
import { AuthContextProps } from '../../types';
import LogoutPage from '../LogoutPage';

configure({ defaultHidden: true });

jest.mock('next/dist/client/router', () => require('next-router-mock'));

beforeEach(() => {
  jest.restoreAllMocks();
  mockRouter.setCurrentUrl('');
});

const renderComponent = (authContextValue?: AuthContextProps) =>
  render(<LogoutPage />, { authContextValue });

const getElement = (key: 'text' | 'title') => {
  switch (key) {
    case 'text':
      return screen.getByText('Olet kirjautunut ulos palvelusta.');
    case 'title':
      return screen.getByRole('heading', { name: 'Uloskirjautuminen' });
  }
};

test('should render logout page', () => {
  renderComponent();

  getElement('text');
  getElement('title');
});

test('should stay in logout page if user is not authenticated', async () => {
  mockRouter.setCurrentUrl('/logout');
  renderComponent();

  await actWait(100);
  expect(mockRouter.asPath).toBe('/logout');
});

test('should route to home page if user is still authenticated', async () => {
  const authContextValue = fakeAuthenticatedAuthContextValue();
  mockRouter.setCurrentUrl('/logout');
  renderComponent(authContextValue);

  await actWait(100);
  expect(mockRouter.asPath).toBe('/fi');
});
