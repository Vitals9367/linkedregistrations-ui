/* eslint-disable max-len */
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import subYears from 'date-fns/subYears';
import { FormikState } from 'formik';
import { rest } from 'msw';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import React from 'react';

import { FORM_NAMES, RESERVATION_NAMES } from '../../../../constants';
import formatDate from '../../../../utils/formatDate';
import {
  fakeEnrolment,
  fakeSeatsReservation,
} from '../../../../utils/mockDataUtils';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  setQueryMocks,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { ROUTES } from '../../../app/routes/constants';
import { event } from '../../../event/__mocks__/event';
import { TEST_EVENT_ID } from '../../../event/constants';
import { languagesResponse } from '../../../language/__mocks__/languages';
import { place } from '../../../place/__mocks__/place';
import { TEST_PLACE_ID } from '../../../place/constants';
import { registration } from '../../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../../registration/constants';
import { SeatsReservation } from '../../../reserveSeats/types';
import { ENROLMENT_INITIAL_VALUES, NOTIFICATIONS } from '../../constants';
import { EnrolmentFormFields } from '../../types';
import SummaryPage from '../SummaryPage';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('next/dist/client/router', () => require('next-router-mock'));

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const enrolment = fakeEnrolment();

const setFormValues = (
  values: Partial<EnrolmentFormFields>,
  reservation?: SeatsReservation
) => {
  const state: FormikState<EnrolmentFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...ENROLMENT_INITIAL_VALUES,
      ...values,
    },
  };

  jest.spyOn(sessionStorage, 'getItem').mockImplementation((key: string) => {
    switch (key) {
      case `${FORM_NAMES.CREATE_ENROLMENT_FORM}-${registration.id}`:
        return JSON.stringify(state);
      case `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registration.id}`:
        return reservation ? JSON.stringify(reservation) : '';
      default:
        return '';
    }
  });
};

const getReservationData = (expirationOffset: number) => {
  const now = new Date();
  let expiration = '';

  if (expirationOffset) {
    expiration = addSeconds(now, expirationOffset).toISOString();
  } else {
    expiration = subSeconds(now, expirationOffset).toISOString();
  }

  const reservation = fakeSeatsReservation({ expiration });

  return reservation;
};

const enrolmentValues: EnrolmentFormFields = {
  accepted: true,
  attendees: [
    {
      audienceMaxAge: null,
      audienceMinAge: null,
      city: 'City',
      dateOfBirth: formatDate(subYears(new Date(), 9)),
      extraInfo: '',
      inWaitingList: false,
      name: 'Participan name',
      streetAddress: 'Street address',
      zip: '00100',
    },
  ],
  email: 'participant@email.com',
  extraInfo: '',
  membershipNumber: '',
  nativeLanguage: 'fi',
  notifications: [NOTIFICATIONS.EMAIL],
  phoneNumber: '+358 44 123 4567',
  serviceLanguage: 'fi',
};

const defaultMocks = [
  rest.get(`*/event/${TEST_EVENT_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(event))
  ),
  rest.get(`*/place/${TEST_PLACE_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(place))
  ),
  rest.get('*/language/', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(languagesResponse))
  ),
  rest.get(`*/registration/${TEST_REGISTRATION_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(registration))
  ),
];

const renderComponent = () => render(<SummaryPage />);

const getElement = (key: 'submitButton') => {
  switch (key) {
    case 'submitButton':
      return screen.getByRole('button', { name: /lähetä ilmoittautuminen/i });
  }
};

test('should route back to enrolment form if reservation data is missing', async () => {
  setQueryMocks(...defaultMocks);

  setFormValues(enrolmentValues);
  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT_SUMMARY,
    query: { registrationId: registration.id },
  });
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/registration/${registration.id}/enrolment/create`
    )
  );
});

test('should route back to enrolment form after clicking submit button if there are any validation errors', async () => {
  const user = userEvent.setup();
  setQueryMocks(...defaultMocks);

  setFormValues({ ...enrolmentValues, email: '' }, getReservationData(1000));
  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT_SUMMARY,
    query: { registrationId: registration.id },
  });
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/registration/${registration.id}/enrolment/create`
    )
  );
});

test('should route to enrolment completed page', async () => {
  const user = userEvent.setup();
  setQueryMocks(
    ...defaultMocks,
    rest.post(`*/signup/`, (req, res, ctx) =>
      res(ctx.status(201), ctx.json(enrolment))
    )
  );

  setFormValues(enrolmentValues, getReservationData(1000));

  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT_SUMMARY,
    query: { registrationId: registration.id },
  });
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/registration/${registration.id}/enrolment/completed`
    )
  );
});

test('should show server errors when post request fails', async () => {
  const user = userEvent.setup();
  setQueryMocks(
    ...defaultMocks,
    rest.post(`*/signup/`, (req, res, ctx) =>
      res(
        ctx.status(400),
        ctx.json({
          city: ['Tämän kentän arvo ei voi olla "null".'],
          detail: 'The participant is too old.',
          name: ['Tämän kentän arvo ei voi olla "null".'],
          non_field_errors: [
            'Kenttien email, registration tulee muodostaa uniikki joukko.',
            'Kenttien phone_number, registration tulee muodostaa uniikki joukko.',
          ],
        })
      )
    )
  );

  setFormValues(enrolmentValues, getReservationData(1000));

  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT_SUMMARY,
    query: { registrationId: registration.id },
  });
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const submitButton = getElement('submitButton');
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
});

test('should show not found page if registration does not exist', async () => {
  setQueryMocks(
    rest.get(`*/registration/not-found/`, (req, res, ctx) =>
      res(ctx.status(404), ctx.json({ errorMessage: 'Not found' }))
    )
  );

  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT_SUMMARY,
    query: { registrationId: 'not-found' },
  });
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await screen.findByRole('heading', {
    name: 'Valitettavasti etsimääsi sivua ei löydy',
  });

  screen.getByText(
    'Hakemaasi sivua ei löytynyt. Yritä myöhemmin uudelleen. Jos ongelma jatkuu, ota meihin yhteyttä.'
  );
});
