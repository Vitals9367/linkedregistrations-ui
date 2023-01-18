import useLocale from '../../../hooks/useLocale';
import { getPlaceFields } from '../../place/utils';
import { Event } from '../types';
import useEventLocation from './useEventLocation';

const useEventLocationText = (event: Event): string => {
  const locale = useLocale();

  const { location } = useEventLocation(event);
  const {
    addressLocality,
    name: locationName,
    streetAddress,
  } = location
    ? getPlaceFields(location, locale)
    : { addressLocality: '', name: '', streetAddress: '' };

  return (
    [locationName, streetAddress, addressLocality]
      .filter((e) => e)
      .join(', ') || '-'
  );
};

export default useEventLocationText;
