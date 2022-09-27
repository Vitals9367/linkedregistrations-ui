/* eslint-disable max-len */
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import CookieConsent from '../CookieConsent';

configure({ defaultHidden: true });

const clearAllCookies = () =>
  document.cookie.split(';').forEach((c) => {
    document.cookie =
      c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  });

beforeEach(() => {
  jest.clearAllMocks();
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  clearAllCookies();
});

const renderApp = async () => render(<CookieConsent />);

const acceptAllCookieText =
  'city-of-helsinki-cookie-consents=%7B%22tunnistamo%22%3Atrue%2C%22enrolmentForm%22%3Atrue%2C%22city-of-helsinki-cookie-consents%22%3Atrue%2C%22matomo%22%3Atrue%7D';
const acceptOnlyNecessaryCookieText =
  'city-of-helsinki-cookie-consents=%7B%22tunnistamo%22%3Atrue%2C%22enrolmentForm%22%3Atrue%2C%22city-of-helsinki-cookie-consents%22%3Atrue%2C%22matomo%22%3Afalse%7D';

const findElement = (key: 'cookieConsentModal') => {
  switch (key) {
    case 'cookieConsentModal':
      return screen.findByTestId('cookie-consent');
  }
};

const waitCookieConsentModalToBeVisible = async () => {
  const cookieConsentModal = await findElement('cookieConsentModal');
  await within(cookieConsentModal).findByRole('heading', {
    name: 'Linked Registrations käyttää evästeitä',
  });

  return cookieConsentModal;
};

const waitCookieConsentModalToBeHidden = async () => {
  await waitFor(() =>
    expect(screen.queryByTestId('cookie-consent')).not.toBeInTheDocument()
  );
};

const findCookieConsentModalElement = async (
  cookieConsentModal: HTMLElement,
  key:
    | 'acceptAllButton'
    | 'acceptOnlyNecessaryButton'
    | 'enOption'
    | 'languageSelector'
    | 'svOption'
) => {
  switch (key) {
    case 'acceptAllButton':
      return within(cookieConsentModal).findByRole('button', {
        name: 'Hyväksy kaikki evästeet',
      });
    case 'acceptOnlyNecessaryButton':
      return within(cookieConsentModal).findByRole('button', {
        name: 'Hyväksy vain pakolliset evästeet',
      });
    case 'enOption':
      return within(cookieConsentModal).findByRole('link', {
        name: 'English (EN)',
      });
    case 'languageSelector':
      return within(cookieConsentModal).findByRole('button', {
        name: /Vaihda kieli. Change language. Ändra språk./i,
      });
    case 'svOption':
      return within(cookieConsentModal).findByRole('link', {
        name: 'Svenska (SV)',
      });
  }
};

it('should show cookie consent modal if consent is not saved to cookie', async () => {
  await renderApp();

  await waitCookieConsentModalToBeVisible();
});

it('should change cookie consent modal language', async () => {
  const user = userEvent.setup();
  await renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const languageSelector = await findCookieConsentModalElement(
    cookieConsentModal,
    'languageSelector'
  );

  const languageElements: {
    optionKey: 'enOption' | 'svOption';
    headingText: string;
  }[] = [
    { optionKey: 'enOption', headingText: 'Linked Registrations uses cookies' },
    {
      optionKey: 'svOption',
      headingText: 'Linked Registrations använder kakor',
    },
  ];

  for (const { optionKey, headingText } of languageElements) {
    await user.click(languageSelector);
    const languageOption = await findCookieConsentModalElement(
      cookieConsentModal,
      optionKey
    );
    await user.click(languageOption);

    await within(cookieConsentModal).findByRole('heading', {
      name: headingText,
    });
  }
});

it('should store consent to cookie when clicing accept all button', async () => {
  const user = userEvent.setup();

  await renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const acceptAllButton = await findCookieConsentModalElement(
    cookieConsentModal,
    'acceptAllButton'
  );
  await user.click(acceptAllButton);

  expect(document.cookie).toEqual(expect.stringContaining(acceptAllCookieText));
  await waitCookieConsentModalToBeHidden();
});

it('should store consent to cookie when clicing accept only necessary button', async () => {
  const user = userEvent.setup();

  await renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const acceptOnlyNecessaryButton = await findCookieConsentModalElement(
    cookieConsentModal,
    'acceptOnlyNecessaryButton'
  );

  await user.click(acceptOnlyNecessaryButton);

  expect(document.cookie).toEqual(
    expect.stringContaining(acceptOnlyNecessaryCookieText)
  );
  await waitCookieConsentModalToBeHidden();
});

it('should not show cookie consent modal if consent is saved', async () => {
  document.cookie = acceptAllCookieText;

  await renderApp();

  await waitCookieConsentModalToBeHidden();
});
