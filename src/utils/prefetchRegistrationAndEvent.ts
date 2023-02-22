/* eslint-disable no-console */
import { QueryClient } from '@tanstack/react-query';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

import { EVENT_INCLUDES } from '../domain/event/constants';
import { fetchEventQuery } from '../domain/event/query';
import { prefetchPlaceQuery } from '../domain/place/query';
import { fetchRegistrationQuery } from '../domain/registration/query';
import { ExtendedSession } from '../types';
import parseIdFromAtId from './parseIdFromAtId';

const prefetchRegistrationAndEvent = async ({
  query,
  queryClient,
  session,
  shouldPrefetchPlace,
}: {
  query: NextParsedUrlQuery;
  queryClient: QueryClient;
  session: ExtendedSession | null;
  shouldPrefetchPlace?: boolean;
}) => {
  try {
    const registration = await fetchRegistrationQuery({
      args: { id: query.registrationId as string },
      queryClient,
      session,
    });

    const event = await fetchEventQuery({
      args: { id: registration?.event, include: EVENT_INCLUDES },
      queryClient,
      session,
    });

    const placeId = parseIdFromAtId(event.location['@id']);

    if (shouldPrefetchPlace && placeId) {
      await prefetchPlaceQuery({ id: placeId, queryClient, session });
    }
  } catch (e) /* istanbul ignore next */ {
    console.error(e);
  }
};

export default prefetchRegistrationAndEvent;
