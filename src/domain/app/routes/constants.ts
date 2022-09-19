export enum ROUTES {
  CALLBACK = '/callback',
  CREATE_ENROLMENT = '/registration/[registrationId]/enrolment/create',
  EDIT_ENROLMENT = '/registration/[registrationId]/enrolment/[accessCode]/edit',
  ENROLMENT_COMPLETED = '/registration/[registrationId]/enrolment/[accessCode]/completed',
  ENROLMENT_CANCELLED = '/registration/[registrationId]/enrolment/cancelled',
  HOME = '/',
  LOGOUT = '/logout',
  SILENT_CALLBACK = '/silent-callback',
}
