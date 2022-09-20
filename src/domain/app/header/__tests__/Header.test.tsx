/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-require-imports */
import i18n from 'i18next';
import { rest } from 'msw';
import mockRouter from 'next-router-mock';
import React from 'react';

import { TEST_USER_ID } from '../../../../constants';
import {
  fakeAuthContextValue,
  fakeAuthenticatedAuthContextValue,
} from '../../../../utils/mockAuthContextValue';
import { fakeUser } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  setQueryMocks,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import Header from '../Header';

configure({ defaultHidden: true });

jest.mock('next/dist/client/router', () => require('next-router-mock'));

beforeEach(() => {
  jest.restoreAllMocks();
  mockRouter.setCurrentUrl('');
  i18n.changeLanguage('fi');
});

const renderComponent = (authContextValue?: AuthContextProps) =>
  render(<Header />, { authContextValue });

const getElement = (key: 'enOption' | 'menuButton' | 'svOption') => {
  switch (key) {
    case 'enOption':
      return screen.getByRole('link', {
        hidden: false,
        name: /In English/i,
      });
    case 'svOption':
      return screen.getByRole('link', {
        hidden: false,
        name: /På svenska/i,
      });
    case 'menuButton':
      return screen.getByRole('button', {
        name: 'Valikko',
      });
  }
};

const getElements = (
  key: 'appName' | 'languageSelector' | 'signInButton' | 'signOutLink'
) => {
  switch (key) {
    case 'appName':
      return screen.getAllByRole('link', {
        name: /linked registrations/i,
      });
    case 'languageSelector':
      return screen.getAllByRole('button', {
        name: /suomi - kielivalikko/i,
      });
    case 'signInButton':
      return screen.getAllByRole('button', { name: /kirjaudu sisään/i });
    case 'signOutLink':
      return screen.getAllByRole('link', { name: /kirjaudu ulos/i });
  }
};

test('should route to home page by clicking application name', async () => {
  const user = userEvent.setup();

  mockRouter.setCurrentUrl('/registrations');
  renderComponent();
  expect(mockRouter.asPath).toBe('/registrations');

  const appName = getElements('appName')[0];
  await user.click(appName);

  expect(mockRouter.asPath).toBe('/fi');
});

test('should show mobile menu', async () => {
  const user = userEvent.setup();
  global.innerWidth = 500;
  renderComponent();

  expect(document.querySelector('#hds-mobile-menu')).not.toBeInTheDocument();
  const menuButton = getElement('menuButton');
  await user.click(menuButton);

  await waitFor(() =>
    expect(document.querySelector('#hds-mobile-menu')).toBeInTheDocument()
  );
});

test('should change language', async () => {
  const user = userEvent.setup();
  renderComponent();

  const languageSelector = getElements('languageSelector')[0];
  await user.click(languageSelector);

  const enOption = getElement('enOption');
  await user.click(enOption);
  expect(mockRouter.locale).toBe('en');

  await user.click(languageSelector);

  const svOption = getElement('svOption');
  await user.click(svOption);
  expect(mockRouter.locale).toBe('sv');
});

test('should start login process', async () => {
  const user = userEvent.setup();

  const signIn = jest.fn();
  const authContextValue = fakeAuthContextValue({ signIn });
  renderComponent(authContextValue);

  const signInButtons = getElements('signInButton');
  await user.click(signInButtons[0]);

  expect(signIn).toBeCalled();
});

test('should start logout process', async () => {
  const user = userEvent.setup();

  const username = 'Username';
  const userData = fakeUser({ display_name: username });

  const defaultMocks = [
    rest.get(`*/user/${TEST_USER_ID}/`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(userData))
    ),
  ];
  setQueryMocks(...defaultMocks);

  const signOut = jest.fn();
  const authContextValue = fakeAuthenticatedAuthContextValue({
    isAuthenticated: true,
    signOut,
  });
  renderComponent(authContextValue);

  const userMenuButton = await screen.findByRole(
    'button',
    { name: username },
    { timeout: 10000 }
  );
  await user.click(userMenuButton);

  const signOutLinks = getElements('signOutLink');
  await user.click(signOutLinks[0]);

  await waitFor(() => expect(signOut).toBeCalled());
});
