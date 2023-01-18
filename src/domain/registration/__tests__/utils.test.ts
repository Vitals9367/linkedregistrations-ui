/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { advanceTo, clear } from 'jest-date-mock';

import { fakeRegistration } from '../../../utils/mockDataUtils';
import { registrationsResponse } from '../__mocks__/registration';
import { RegistrationQueryVariables } from '../types';
import {
  getAttendeeCapacityError,
  getFreeAttendeeCapacity,
  getFreeWaitlistCapacity,
  getRegistrationWarning,
  isAttendeeCapacityUsed,
  isRegistrationOpen,
  isWaitingCapacityUsed,
  registrationPathBuilder,
} from '../utils';

afterEach(() => {
  clear();
});

describe('getRegistrationWarning', () => {
  it('should return empty string if it is possible to enrol to the event', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[0], i18n.t.bind(i18n))
    ).toBe('');
  });

  it('should return correct warning if there is space in waiting list', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[1], i18n.t.bind(i18n))
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on vielä mahdollista, mutta jonopaikkoja on jäljellä vain 10 kpl.'
    );
  });

  it('should return correct warning if all spaces are gone and there are no waiting list', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[2], i18n.t.bind(i18n))
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });
  it('should return correct warning if it is not possible to enrol to the event', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[3], i18n.t.bind(i18n))
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });

  it('should return empty string if maximum attendee capacity is not set', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[4], i18n.t.bind(i18n))
    ).toBe('');
  });
});

describe('getAttendeeCapacityError', () => {
  it('should return undefined if maximum_attendee_capacity is not defined', () => {
    expect(
      getAttendeeCapacityError(
        fakeRegistration({ maximum_attendee_capacity: null }),
        4,
        i18n.t.bind(i18n)
      )
    ).toBeUndefined();
  });

  it('should return correct error if participantAmount is less than 1', () => {
    expect(
      getAttendeeCapacityError(
        fakeRegistration({ maximum_attendee_capacity: null }),
        0,
        i18n.t.bind(i18n)
      )
    ).toBe('Osallistujien vähimmäismäärä on 1.');
  });

  it('should return correct error if participantAmount is greater than maximum_attendee_capacity', () => {
    expect(
      getAttendeeCapacityError(
        fakeRegistration({ maximum_attendee_capacity: 3 }),
        4,
        i18n.t.bind(i18n)
      )
    ).toBe('Osallistujien enimmäismäärä on 3.');
  });
});

describe('isAttendeeCapacityUsed', () => {
  it('should return false if maximum_attendee_capacity is not defined', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({ maximum_attendee_capacity: null })
      )
    ).toBe(false);
  });

  it('should return correct false if current attendee count is less than maximum attendee capacity', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({
          current_attendee_count: 4,
          maximum_attendee_capacity: 40,
        })
      )
    ).toBe(false);
  });

  it('should return correct true if current attendee count equals maximum attendee capacity', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({
          current_attendee_count: 40,
          maximum_attendee_capacity: 40,
        })
      )
    ).toBe(true);
  });

  it('should return correct true if current attendee count is greater than maximum attendee capacity', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({
          current_attendee_count: 41,
          maximum_attendee_capacity: 40,
        })
      )
    ).toBe(true);
  });
});

describe('getFreeAttendeeCapacity', () => {
  it('should return undefined if maximum_attendee_capacity is not defined', () => {
    expect(
      getFreeAttendeeCapacity(
        fakeRegistration({ maximum_attendee_capacity: null })
      )
    ).toBeUndefined();
  });

  it('should return correct amount if maximum_attendee_capacity is defined', () => {
    expect(
      getFreeAttendeeCapacity(
        fakeRegistration({
          current_attendee_count: 4,
          maximum_attendee_capacity: 40,
        })
      )
    ).toBe(36);
  });
});

describe('getFreeWaitlistCapacity', () => {
  it('should return 0 if waiting_list_capacity is not defined', () => {
    expect(
      getFreeWaitlistCapacity(fakeRegistration({ waiting_list_capacity: null }))
    ).toBe(0);
  });

  it('should return correct amount if waiting_list_capacity is defined', () => {
    expect(
      getFreeWaitlistCapacity(
        fakeRegistration({
          current_waiting_list_count: 4,
          waiting_list_capacity: 40,
        })
      )
    ).toBe(36);
  });
});

describe('isWaitingCapacityUsed', () => {
  it('should return true if waiting_list_capacity is not defined', () => {
    expect(
      isWaitingCapacityUsed(fakeRegistration({ waiting_list_capacity: null }))
    ).toBe(true);
  });

  it('should return true if current waiting list count is greater than waiting_list_capacity', () => {
    expect(
      isWaitingCapacityUsed(
        fakeRegistration({
          waiting_list_capacity: 15,
          current_waiting_list_count: 16,
        })
      )
    ).toBe(true);
  });

  it('should return true if current waiting list count equals waiting_list_capacity', () => {
    expect(
      isWaitingCapacityUsed(
        fakeRegistration({
          waiting_list_capacity: 15,
          current_waiting_list_count: 15,
        })
      )
    ).toBe(true);
  });

  it('should return true if current waiting list count is less than waiting_list_capacity', () => {
    expect(
      isWaitingCapacityUsed(
        fakeRegistration({
          waiting_list_capacity: 15,
          current_waiting_list_count: 14,
        })
      )
    ).toBe(false);
  });
});

describe('isRegistrationOpen', () => {
  it('should return false if enrolment_start_time is not defined', () => {
    expect(
      isRegistrationOpen(fakeRegistration({ enrolment_start_time: '' }))
    ).toBe(false);
  });

  it('should return false if enrolment_start_time is not in the past', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolment_start_time: new Date('2022-11-08').toISOString(),
        })
      )
    ).toBe(false);
  });

  it('should return false if enrolment_start_time is in the past and enrolment_start_time is in the past', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolment_end_time: new Date('2022-11-06').toISOString(),
          enrolment_start_time: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(false);
  });

  it('should return true if enrolment_start_time is in the past and enrolment_start_time is not defined', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolment_end_time: '',
          enrolment_start_time: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(true);
  });

  it('should return true if enrolment_start_time is in the past and enrolment_start_time is in the future', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolment_end_time: new Date('2022-11-08').toISOString(),
          enrolment_start_time: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(true);
  });
});

describe('registrationPathBuilder function', () => {
  const cases: [RegistrationQueryVariables, string][] = [
    [{ id: 'hel:123' }, '/registration/hel:123/?nocache=true'],
    [
      { id: 'hel:123', include: ['include1'] },
      '/registration/hel:123/?include=include1&nocache=true',
    ],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(registrationPathBuilder(variables)).toBe(expectedPath)
  );
});
