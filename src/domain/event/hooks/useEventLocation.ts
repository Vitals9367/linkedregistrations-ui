import { useSession } from 'next-auth/react';

import { ExtendedSession } from '../../../types';
import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { usePlaceQuery } from '../../place/query';
import { Place } from '../../place/types';
import { Event } from '../types';

type UseEventLocationState = {
  isLoading: boolean;
  location: Place | null;
};

const useEventLocation = (event: Event): UseEventLocationState => {
  const { data: session } = useSession() as { data: ExtendedSession | null };

  /* istanbul ignore next */
  const id: string = event.location?.['@id']
    ? (parseIdFromAtId(event.location['@id']) as string)
    : '';
  const { data, isLoading } = usePlaceQuery({ id, session });

  return { isLoading, location: data ?? null };
};

export default useEventLocation;
