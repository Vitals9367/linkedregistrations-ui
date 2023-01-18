import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { CreateEnrolmentMutationInput, CreateEnrolmentResponse } from './types';
import { createEnrolment, deleteEnrolment } from './utils';

export const useCreateEnrolmentMutation = (
  registrationId: string,
  options?: UseMutationOptions<
    CreateEnrolmentResponse,
    Error,
    CreateEnrolmentMutationInput
  >
): UseMutationResult<
  CreateEnrolmentResponse,
  Error,
  CreateEnrolmentMutationInput
> => {
  return useMutation(
    (input) => createEnrolment(registrationId, input),
    options
  );
};

export const useDeleteEnrolmentMutation = (
  options?: UseMutationOptions<null, Error, string>
): UseMutationResult<null, Error, string> => {
  return useMutation(
    (cancellationCode) => deleteEnrolment(cancellationCode),
    options
  );
};
