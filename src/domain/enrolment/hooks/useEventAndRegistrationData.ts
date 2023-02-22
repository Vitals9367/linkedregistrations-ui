import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { ExtendedSession } from '../../../types';
import { EVENT_INCLUDES } from '../../event/constants';
import { useEventQuery } from '../../event/query';
import { Event } from '../../event/types';
import { useRegistrationQuery } from '../../registration/query';
import { Registration } from '../../registration/types';

type UseEventAndRegistrationDataState = {
  event: Event | undefined;
  isLoading: boolean;
  registration: Registration | undefined;
};

const useEventAndRegistrationData = (): UseEventAndRegistrationDataState => {
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession() as { data: ExtendedSession | null };

  const {
    data: registration,
    isFetching: isFetchingRegistration,
    status: statusRegistration,
  } = useRegistrationQuery({
    args: { id: query.registrationId as string },
    options: { enabled: !!query.registrationId, retry: 0 },
    session,
  });

  const {
    data: event,
    isFetching: isFetchingEvent,
    status: statusEvent,
  } = useEventQuery({
    args: {
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
    options: { enabled: !!registration?.event },
    session,
  });

  const isLoading =
    (statusRegistration === 'loading' && isFetchingRegistration) ||
    (statusEvent === 'loading' && isFetchingEvent);

  return { event, isLoading, registration };
};

export default useEventAndRegistrationData;
