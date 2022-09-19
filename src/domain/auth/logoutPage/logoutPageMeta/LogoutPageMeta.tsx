import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React from 'react';

const LogoutPageMeta: React.FC = () => {
  const { t } = useTranslation('common');

  const description = t('logoutPage.text');
  const title = t('logoutPage.title');

  const openGraphProperties = { description, title };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary" />
      {Object.entries(openGraphProperties)
        .filter((p) => p)
        .map(([property, value]) => (
          <meta key={property} property={`og:${property}`} content={value} />
        ))}
    </Head>
  );
};

export default LogoutPageMeta;
