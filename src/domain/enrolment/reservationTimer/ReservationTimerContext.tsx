import pick from 'lodash/pick';
import { useRouter } from 'next/router';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';

import { ROUTES } from '../../app/routes/constants';
import { reportError } from '../../app/sentry/utils';
import { Registration } from '../../registration/types';
import { useReserveSeatsMutation } from '../../reserveSeats/mutation';
import {
  getRegistrationTimeLeft,
  getSeatsReservationData,
  isSeatsReservationExpired,
  setSeatsReservationData,
} from '../../reserveSeats/utils';
import { ENROLMENT_MODALS, ENROLMENT_QUERY_PARAMS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import ReservationTimeExpiredModal from '../modals/reservationTimeExpiredModal/ReservationTimeExpiredModal';
import { AttendeeFields } from '../types';
import {
  clearCreateEnrolmentFormData,
  clearEnrolmentReservationData,
  getNewAttendees,
} from '../utils';

export type ReservationTimerContextProps = {
  disableCallbacks: () => void;
  registration: Registration;
  timeLeft: number | null;
};

export const ReservationTimerContext = React.createContext<
  ReservationTimerContextProps | undefined
>(undefined);

interface Props {
  attendees?: AttendeeFields[];
  initializeReservationData: boolean;
  registration: Registration;
  setAttendees?: (value: AttendeeFields[]) => void;
}

export const ReservationTimerProvider: FC<PropsWithChildren<Props>> = ({
  attendees,
  children,
  initializeReservationData,
  registration,
  setAttendees,
}) => {
  const { openModal, setOpenModal } = useEnrolmentPageContext();
  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();
  const router = useRouter();
  const creatingReservationStarted = useRef(false);
  const callbacksDisabled = useRef(false);
  const timerEnabled = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const enableTimer = useCallback(() => {
    timerEnabled.current = true;
  }, []);

  const reserveSeatsMutation = useReserveSeatsMutation({
    onError: (error, variables) => {
      showServerErrors(
        { error: JSON.parse(error.message) },
        'seatsReservation'
      );

      reportError({
        data: {
          error: JSON.parse(error.message),
          payload: variables,
          payloadAsString: JSON.stringify(variables),
        },
        message: 'Failed to reserve seats',
      });
    },
    onSuccess: (seatsReservation) => {
      enableTimer();
      setSeatsReservationData(registration.id, seatsReservation);
      setTimeLeft(getRegistrationTimeLeft(seatsReservation));

      if (setAttendees) {
        const newAttendees = getNewAttendees({
          attendees: attendees || /* istanbul ignore next */ [],
          registration,
          seatsReservation,
        });

        setAttendees(newAttendees);
      }

      if (seatsReservation.waitlist_spots) {
        setOpenModal(ENROLMENT_MODALS.PERSONS_ADDED_TO_WAITLIST);
      }
    },
  });

  const disableCallbacks = useCallback(() => {
    callbacksDisabled.current = true;
  }, []);

  const goToPage = (pathname: string) => {
    router.push({
      pathname,
      query: pick(router.query, [
        ENROLMENT_QUERY_PARAMS.IFRAME,
        ENROLMENT_QUERY_PARAMS.REDIRECT_URL,
      ]),
    });
  };

  const handleTryAgain = () => {
    if (router.pathname === ROUTES.CREATE_ENROLMENT) {
      router.reload();
    } else {
      goToPage(
        ROUTES.CREATE_ENROLMENT.replace(
          '[registrationId]',
          router.query.registrationId as string
        )
      );
    }
  };

  React.useEffect(() => {
    const data = getSeatsReservationData(registration.id);

    if (
      initializeReservationData &&
      !creatingReservationStarted.current &&
      !data
    ) {
      creatingReservationStarted.current = true;
      // Clear server errors
      setServerErrorItems([]);

      // useEffect runs twice in React v18.0, so start creatin nre seats reservation
      // only if creatingReservationStarted is false
      reserveSeatsMutation.mutate({
        registration: registration.id,
        seats: 1,
        waitlist: true,
      });
    } else if (data) {
      enableTimer();
      setTimeLeft(getRegistrationTimeLeft(data));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      /* istanbul ignore else */
      if (timerEnabled.current) {
        const data = getSeatsReservationData(registration.id);
        setTimeLeft(getRegistrationTimeLeft(data));

        /* istanbul ignore else */
        if (!callbacksDisabled.current) {
          if (!data || isSeatsReservationExpired(data)) {
            disableCallbacks();

            clearCreateEnrolmentFormData(registration.id);
            clearEnrolmentReservationData(registration.id);

            setOpenModal(ENROLMENT_MODALS.RESERVATION_TIME_EXPIRED);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [disableCallbacks, registration, setOpenModal, setTimeLeft, timeLeft]);

  return (
    <ReservationTimerContext.Provider
      value={{
        disableCallbacks,
        registration,
        timeLeft,
      }}
    >
      <ReservationTimeExpiredModal
        isOpen={openModal === ENROLMENT_MODALS.RESERVATION_TIME_EXPIRED}
        onTryAgain={handleTryAgain}
      />
      {children}
    </ReservationTimerContext.Provider>
  );
};
