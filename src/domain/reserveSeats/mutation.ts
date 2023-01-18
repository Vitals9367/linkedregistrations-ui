import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import {
  ReserveSeatsInput,
  SeatsReservation,
  UpdateReserveSeatsInput,
} from './types';
import { reserveSeats, updateReserveSeats } from './utils';

export const useReserveSeatsMutation = (
  options?: UseMutationOptions<SeatsReservation, Error, ReserveSeatsInput>
): UseMutationResult<SeatsReservation, Error, ReserveSeatsInput> =>
  useMutation((input) => reserveSeats(input), options);

export const useUpdateReserveSeatsMutation = (
  options?: UseMutationOptions<SeatsReservation, Error, UpdateReserveSeatsInput>
): UseMutationResult<SeatsReservation, Error, UpdateReserveSeatsInput> =>
  useMutation((input) => updateReserveSeats(input), options);
