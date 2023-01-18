import { useEffect } from 'react';

import { Registration } from '../../../registration/types';
import { getSeatsReservationData } from '../../../reserveSeats/utils';

export interface ReservationTimerCallbacks {
  onDataNotFound?: () => void;
}

type Props = {
  registration: Registration;
} & ReservationTimerCallbacks;

const useReservationTimerCallbacks = ({
  onDataNotFound,
  registration,
}: Props): null => {
  useEffect(() => {
    const data = getSeatsReservationData(registration.id);

    if (!data) {
      onDataNotFound && onDataNotFound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default useReservationTimerCallbacks;
