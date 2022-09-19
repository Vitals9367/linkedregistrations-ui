import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorTemplate from '../../../common/components/errorTemplate/ErrorTemplate';
import useLocale from '../../../hooks/useLocale';
import MainContent from '../../app/layout/mainContent/MainContent';
import { ROUTES } from '../../app/routes/constants';
import { useAuth } from '../hooks/useAuth';
import LogoutPageMeta from './logoutPageMeta/LogoutPageMeta';

const LogoutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('common');
  const locale = useLocale();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${locale}${ROUTES.HOME}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <MainContent>
      <LogoutPageMeta />
      <ErrorTemplate
        text={t('logoutPage.text')}
        title={t('logoutPage.title')}
      />
    </MainContent>
  );
};

export default LogoutPage;
