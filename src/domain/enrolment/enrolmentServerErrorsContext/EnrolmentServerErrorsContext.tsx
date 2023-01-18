/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from 'next-i18next';
import React, { FC, PropsWithChildren } from 'react';

import { ServerErrorItem } from '../../../types';
import {
  parseEnrolmentServerErrors,
  parseSeatsReservationServerErrors,
} from './utils';

type ShowServerErrorsFnParams = {
  error: any;
};

type RequestType = 'enrolment' | 'seatsReservation';

export type EnrolmentServerErrorsContextProps = {
  serverErrorItems: ServerErrorItem[];
  setServerErrorItems: (items: ServerErrorItem[]) => void;
  showServerErrors: (
    params: ShowServerErrorsFnParams,
    type: RequestType
  ) => void;
};

export const EnrolmentServerErrorsContext = React.createContext<
  EnrolmentServerErrorsContextProps | undefined
>(undefined);

export const EnrolmentServerErrorsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation('enrolment');

  const [serverErrorItems, setServerErrorItems] = React.useState<
    ServerErrorItem[]
  >([]);

  const showServerErrors = (
    { error }: ShowServerErrorsFnParams,
    type: RequestType
  ) => {
    /* istanbul ignore else */
    if (error) {
      switch (type) {
        case 'enrolment':
          setServerErrorItems(parseEnrolmentServerErrors({ error, t }));
          break;
        case 'seatsReservation':
          setServerErrorItems(parseSeatsReservationServerErrors({ error, t }));
          break;
      }
    }
  };

  return (
    <EnrolmentServerErrorsContext.Provider
      value={{
        serverErrorItems,
        setServerErrorItems,
        showServerErrors,
      }}
    >
      {children}
    </EnrolmentServerErrorsContext.Provider>
  );
};
