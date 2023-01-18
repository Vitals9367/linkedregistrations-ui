import { AxiosError } from 'axios';
import isPast from 'date-fns/isPast';

import { RESERVATION_NAMES } from '../../constants';
import getUnixTime from '../../utils/getUnixTime';
import { callPost } from '../app/axios/axiosClient';
import {
  ReserveSeatsInput,
  SeatsReservation,
  UpdateReserveSeatsInput,
} from './types';

export const reserveSeats = async ({
  registration,
  ...input
}: ReserveSeatsInput): Promise<SeatsReservation> => {
  try {
    const { data } = await callPost(
      `/registration/${registration}/reserve_seats/`,
      JSON.stringify(input)
    );
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

// TODO: Update seats reservation instead of creating new one
// when API supports PUT request
export const updateReserveSeats = async ({
  code,
  registration,
  ...input
}: UpdateReserveSeatsInput): Promise<SeatsReservation> => {
  try {
    const { data } = await callPost(
      `/registration/${registration}/reserve_seats/`,
      JSON.stringify(input)
    );
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const getSeatsReservationData = (
  registrationId: string
): SeatsReservation | null => {
  /* istanbul ignore next */
  if (typeof sessionStorage === 'undefined') return null;

  const data = sessionStorage?.getItem(
    `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registrationId}`
  );

  return data ? JSON.parse(data) : null;
};

export const setSeatsReservationData = (
  registrationId: string,
  seatsReservation: SeatsReservation
): void => {
  sessionStorage?.setItem(
    `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registrationId}`,
    JSON.stringify(seatsReservation)
  );
};

export const isSeatsReservationExpired = (data: SeatsReservation) => {
  return isPast(new Date(data.expiration));
};

export const getRegistrationTimeLeft = (data: SeatsReservation | null) => {
  const now = new Date();

  return data ? getUnixTime(new Date(data.expiration)) - getUnixTime(now) : 0;
};
