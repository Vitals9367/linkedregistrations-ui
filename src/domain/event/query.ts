import {
  QueryClient,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { ExtendedSession } from '../../types';
import { Event, EventQueryVariables } from './types';
import { fetchEvent } from './utils';

export const fetchEventQuery = ({
  args,
  queryClient,
  session,
}: {
  args: EventQueryVariables;
  queryClient: QueryClient;
  session: ExtendedSession | null;
}): Promise<Event> => {
  return queryClient.fetchQuery(['event', args.id], () =>
    fetchEvent(args, session)
  );
};

export const prefetchEventQuery = ({
  args,
  queryClient,
  session,
}: {
  args: EventQueryVariables;
  queryClient: QueryClient;
  session: ExtendedSession | null;
}): Promise<void> => {
  return queryClient.prefetchQuery(['event', args.id], () =>
    fetchEvent(args, session)
  );
};

export const useEventQuery = ({
  args,
  options,
  session,
}: {
  args: EventQueryVariables;
  options?: Pick<UseQueryOptions, 'enabled'>;
  session: ExtendedSession | null;
}): UseQueryResult<Event> => {
  return useQuery<Event, Error>(
    ['event', args.id],
    () => fetchEvent(args, session),
    options
  );
};
