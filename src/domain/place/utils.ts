import { AxiosError } from 'axios';

import { ExtendedSession, Language } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import { callGet } from '../app/axios/axiosClient';
import { Place, PlaceFields } from './types';

export const fetchPlace = async (
  id: string,
  session: ExtendedSession | null
): Promise<Event> => {
  try {
    const { data } = await callGet({ session, url: `/place/${id}/` });
    return data;
  } catch (error) {
    /* istanbul ignore next */
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const getPlaceFields = (place: Place, locale: Language): PlaceFields => {
  return {
    addressLocality: getLocalisedString(place.address_locality, locale),
    name: getLocalisedString(place.name, locale),
    streetAddress: getLocalisedString(place.street_address, locale),
  };
};
