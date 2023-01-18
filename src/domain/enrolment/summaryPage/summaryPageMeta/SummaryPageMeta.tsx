import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React from 'react';

import useLocale from '../../../../hooks/useLocale';
import getLocalisedString from '../../../../utils/getLocalisedString';
import { Event } from '../../../event/types';
import { getEventFields } from '../../../event/utils';

interface Props {
  event: Event;
}

const SummaryPageMeta: React.FC<Props> = ({ event }) => {
  const { t } = useTranslation('summary');
  const locale = useLocale();

  const title = t('pageTitle');
  const {
    keywords,
    imageUrl: image,
    shortDescription: description,
  } = getEventFields(event, locale);

  const openGraphProperties = {
    description: description,
    image: image as string,
    title,
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={keywords
          .map((keyword) =>
            getLocalisedString(keyword.name, locale).toLowerCase()
          )
          .join(', ')}
      />
      <meta name="twitter:card" content="summary" />
      {Object.entries(openGraphProperties)
        .filter((p) => p)
        .map(([property, value]) => (
          <meta key={property} property={`og:${property}`} content={value} />
        ))}
    </Head>
  );
};

export default SummaryPageMeta;
