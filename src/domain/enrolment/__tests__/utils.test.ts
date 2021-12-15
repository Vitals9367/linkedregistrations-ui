import { fakeEnrolment, fakeRegistration } from '../../../utils/mockDataUtils';
import { registration } from '../../registration/__mocks__/registration';
import {
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from '../constants';
import {
  getEnrolmentDefaultInitialValues,
  getEnrolmentInitialValues,
  getEnrolmentNotificationsCode,
  getEnrolmentNotificationTypes,
  getEnrolmentPayload,
} from '../utils';

describe('getEnrolmentNotificationsCode function', () => {
  it('should return correct notification core', () => {
    expect(getEnrolmentNotificationsCode([])).toBe(
      NOTIFICATION_TYPE.NO_NOTIFICATION
    );
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.SMS])).toBe(
      NOTIFICATION_TYPE.SMS
    );
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL])).toBe(
      NOTIFICATION_TYPE.EMAIL
    );
    expect(
      getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS])
    ).toBe(NOTIFICATION_TYPE.SMS_EMAIL);
  });
});

describe('getEnrolmentPayload function', () => {
  it('should return single enrolment as payload', () => {
    expect(getEnrolmentPayload(ENROLMENT_INITIAL_VALUES, registration)).toEqual(
      {
        city: null,
        date_of_birth: null,
        email: null,
        extra_info: '',
        membership_number: '',
        name: null,
        native_language: null,
        notifications: NOTIFICATION_TYPE.NO_NOTIFICATION,
        phone_number: null,
        registration: registration.id,
        service_language: null,
        street_address: null,
        zipcode: null,
      }
    );

    const city = 'City',
      dateOfBirth = '10.10.1999',
      email = 'Email',
      extraInfo = 'Extra info',
      membershipNumber = 'XXX-123',
      name = 'Name',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const payload = getEnrolmentPayload(
      {
        ...ENROLMENT_INITIAL_VALUES,
        city,
        dateOfBirth,
        email,
        extraInfo,
        membershipNumber,
        name,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
        streetAddress,
        zip: zipcode,
      },
      registration
    );

    expect(payload).toEqual({
      city,
      date_of_birth: '1999-10-10',
      email,
      extra_info: extraInfo,
      membership_number: membershipNumber,
      name,
      native_language: nativeLanguage,
      notifications: NOTIFICATION_TYPE.EMAIL,
      phone_number: phoneNumber,
      registration: registration.id,
      service_language: serviceLanguage,
      street_address: streetAddress,
      zipcode,
    });
  });
});

describe('getEnrolmentDefaultInitialValues function', () => {
  it('should return enrolment initial values', () => {
    expect(
      getEnrolmentDefaultInitialValues(
        fakeRegistration({
          audience_max_age: 18,
          audience_min_age: 8,
        })
      )
    ).toEqual({
      accepted: false,
      audienceMaxAge: 18,
      audienceMinAge: 8,
      city: '',
      dateOfBirth: '',
      email: '',
      extraInfo: '',
      membershipNumber: '',
      name: '',
      nativeLanguage: '',
      notifications: [],
      phoneNumber: '',
      serviceLanguage: '',
      streetAddress: '',
      zip: '',
    });

    expect(
      getEnrolmentDefaultInitialValues(
        fakeRegistration({
          audience_max_age: null,
          audience_min_age: null,
        })
      )
    ).toEqual({
      accepted: false,
      audienceMaxAge: null,
      audienceMinAge: null,
      city: '',
      dateOfBirth: '',
      email: '',
      extraInfo: '',
      membershipNumber: '',
      name: '',
      nativeLanguage: '',
      notifications: [],
      phoneNumber: '',
      serviceLanguage: '',
      streetAddress: '',
      zip: '',
    });
  });
});

describe('getEnrolmentInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      audienceMaxAge,
      audienceMinAge,
      city,
      dateOfBirth,
      email,
      extraInfo,
      membershipNumber,
      name,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      streetAddress,
      zip,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: null,
        date_of_birth: null,
        email: null,
        extra_info: null,
        membership_number: null,
        name: null,
        native_language: null,
        notifications: NOTIFICATION_TYPE.NO_NOTIFICATION,
        phone_number: null,
        service_language: null,
        street_address: null,
        zipcode: null,
      }),
      fakeRegistration({ audience_min_age: null, audience_max_age: null })
    );

    expect(audienceMaxAge).toBe(null);
    expect(audienceMinAge).toBe(null);
    expect(city).toBe('-');
    expect(dateOfBirth).toBe('');
    expect(email).toBe('-');
    expect(extraInfo).toBe('-');
    expect(membershipNumber).toBe('-');
    expect(name).toBe('-');
    expect(nativeLanguage).toBe('');
    expect(notifications).toEqual([]);
    expect(phoneNumber).toBe('-');
    expect(serviceLanguage).toBe('');
    expect(streetAddress).toBe('-');
    expect(zip).toBe('-');
  });

  it('should return enrolment initial values', () => {
    const expectedCity = 'City';
    const expectedDateOfBirth = '10.10.2021';
    const expectedEmail = 'user@email.com';
    const expectedExtraInfo = 'Extra info';
    const expectedMembershipNumber = 'XXX-XXX-XXX';
    const expectedName = 'Name';
    const expectedNativeLanguage = 'fi';
    const expectedNotifications = [NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS];
    const expectedPhoneNumber = '+358 44 123 4567';
    const expectedServiceLanguage = 'sv';
    const expectedStreetAddress = 'Test address';
    const expectedZip = '12345';

    const {
      audienceMaxAge,
      audienceMinAge,
      city,
      dateOfBirth,
      email,
      extraInfo,
      membershipNumber,
      name,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      streetAddress,
      zip,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: expectedCity,
        date_of_birth: '2021-10-10',
        email: expectedEmail,
        extra_info: expectedExtraInfo,
        membership_number: expectedMembershipNumber,
        name: expectedName,
        native_language: expectedNativeLanguage,
        notifications: NOTIFICATION_TYPE.SMS_EMAIL,
        phone_number: expectedPhoneNumber,
        service_language: expectedServiceLanguage,
        street_address: expectedStreetAddress,
        zipcode: expectedZip,
      }),
      registration
    );

    expect(audienceMaxAge).toBe(18);
    expect(audienceMinAge).toBe(8);
    expect(city).toBe(expectedCity);
    expect(dateOfBirth).toEqual(expectedDateOfBirth);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe(expectedExtraInfo);
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(name).toBe(expectedName);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
    expect(streetAddress).toBe(expectedStreetAddress);
    expect(zip).toBe(expectedZip);
  });
});

describe('getEnrolmentNotificationTypes function', () => {
  it('should return correct notification types', () => {
    expect(
      getEnrolmentNotificationTypes(NOTIFICATION_TYPE.NO_NOTIFICATION)
    ).toEqual([]);
    expect(getEnrolmentNotificationTypes(NOTIFICATION_TYPE.SMS)).toEqual([
      NOTIFICATIONS.SMS,
    ]);
    expect(getEnrolmentNotificationTypes(NOTIFICATION_TYPE.EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
    ]);
    expect(getEnrolmentNotificationTypes(NOTIFICATION_TYPE.SMS_EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
      NOTIFICATIONS.SMS,
    ]);
    expect(getEnrolmentNotificationTypes('lorem ipsum')).toEqual([]);
  });
});
