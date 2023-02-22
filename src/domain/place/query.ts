import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { ExtendedSession } from '../../types';
import { Place } from './types';
import { fetchPlace } from './utils';

export const prefetchPlaceQuery = ({
  id,
  queryClient,
  session,
}: {
  queryClient: QueryClient;
  id: string;
  session: ExtendedSession | null;
}): Promise<void> =>
  queryClient.prefetchQuery(['place', id], () => fetchPlace(id, session));

export const usePlaceQuery = ({
  id,
  session,
}: {
  id: string;
  session: ExtendedSession | null;
}): UseQueryResult<Place> => {
  return useQuery(['place', id], () => fetchPlace(id, session));
};
