import { useTranslation } from 'next-i18next';
import React from 'react';

import { useReservationTimer } from './hooks/useReservationTimer';
import useReservationTimerCallbacks, {
  ReservationTimerCallbacks,
} from './hooks/useReservationTimerCallbacks';

const getTimeStr = (timeLeft: number) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor(timeLeft / 60) % 60;
  const seconds = timeLeft % 60;

  return [
    hours,
    ...[minutes, seconds].map((n) => n.toString().padStart(2, '0')),
  ]
    .filter((i) => i)
    .join(':');
};

const ReservationTimer: React.FC<ReservationTimerCallbacks> = ({
  onDataNotFound,
}) => {
  const { t } = useTranslation('enrolment');
  const { registration, timeLeft } = useReservationTimer();

  // Handle reservation missing callback
  useReservationTimerCallbacks({ onDataNotFound, registration });

  return (
    <div>
      {t('timeLeft')}{' '}
      <strong>{timeLeft !== null && getTimeStr(timeLeft)}</strong>
    </div>
  );
};

export default ReservationTimer;
