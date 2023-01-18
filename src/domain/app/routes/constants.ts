export enum ROUTES {
  CALLBACK = '/api/auth/callback/tunnistamo',
  CREATE_ENROLMENT = '/registration/[registrationId]/enrolment/create',
  CREATE_ENROLMENT_SUMMARY = '/registration/[registrationId]/enrolment/create/summary',
  EDIT_ENROLMENT = '/registration/[registrationId]/enrolment/[accessCode]/edit',
  ENROLMENT_COMPLETED = '/registration/[registrationId]/enrolment/completed',
  ENROLMENT_CANCELLED = '/registration/[registrationId]/enrolment/cancelled',
  HOME = '/',
}
