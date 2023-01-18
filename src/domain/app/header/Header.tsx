import classNames from 'classnames';
import { IconArrowLeft, IconSignout, Navigation } from 'hds-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import { MAIN_CONTENT_ID, PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import { ExtendedSession } from '../../../types';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useUserQuery } from '../../user/query';
import { ROUTES } from '../routes/constants';
import styles from './header.module.scss';

interface NavigationItem {
  icon?: React.ReactElement;
  labelKey: string;
  url: string;
}

const Header: React.FC = () => {
  const { data } = useSession();
  const session = data as ExtendedSession;

  const { data: user } = useUserQuery(
    { username: session?.sub as string },
    { enabled: Boolean(session?.sub && session?.apiToken) }
  );

  const locale = useLocale();
  const router = useRouter();

  const { changeLanguage, languageOptions } = useSelectLanguage();

  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = React.useState(false);

  const NAVIGATION_ITEMS: NavigationItem[] = [
    router.pathname === ROUTES.CREATE_ENROLMENT_SUMMARY && {
      icon: <IconArrowLeft aria-hidden />,
      labelKey: 'navigation.backToEnrolmentForm',
      url: ROUTES.CREATE_ENROLMENT.replace(
        '[registrationId]',
        router.query.registrationId as string
      ),
    },
  ].filter(skipFalsyType);

  const navigationItems = NAVIGATION_ITEMS.map(
    ({ labelKey, url, ...rest }) => ({
      label: t(labelKey),
      url,
      ...rest,
    })
  );

  const goToHomePage = (e?: Event) => {
    e?.preventDefault();
    router.push(ROUTES.HOME);
    setMenuOpen(false);
  };

  const goToPage =
    (pathname: string) => (e?: React.MouseEvent<HTMLAnchorElement>) => {
      e?.preventDefault();
      router.push(pathname);
      toggleMenu();
    };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Navigation
      id={PAGE_HEADER_ID}
      menuOpen={menuOpen}
      onMenuToggle={toggleMenu}
      menuToggleAriaLabel={t('navigation.menuToggleAriaLabel')}
      skipTo={`#${MAIN_CONTENT_ID}`}
      skipToContentLabel={t('navigation.skipToContentLabel')}
      className={styles.navigation}
      onTitleClick={goToHomePage}
      title={t('appName')}
      titleUrl={`/${locale}${ROUTES.HOME}`}
      logoLanguage={locale === 'sv' ? /* istanbul ignore next */ 'sv' : 'fi'}
    >
      <Navigation.Row>
        {navigationItems.map((item, index) => (
          <Navigation.Item
            variant="primary"
            key={index}
            icon={item.icon}
            href={item.url}
            label={item.label}
            onClick={goToPage(item.url)}
          />
        ))}
      </Navigation.Row>

      <Navigation.Actions>
        <Navigation.User
          authenticated={Boolean(session?.apiToken && user)}
          label={t('common:signIn')}
          onSignIn={() => signIn('tunnistamo')}
          userName={user?.display_name}
        >
          <Navigation.Item
            label={t('common:signOut')}
            href="#"
            icon={<IconSignout aria-hidden />}
            variant="supplementary"
            onClick={() => signOut()}
          />
        </Navigation.User>
        <Navigation.LanguageSelector
          buttonAriaLabel={t('navigation.languageSelectorAriaLabel') as string}
          className={classNames(styles.languageSelector)}
          label={t(`navigation.languages.${locale}`)}
        >
          {languageOptions.map((option) => (
            <Navigation.Item
              key={option.value}
              href="#"
              lang={option.value}
              label={option.label}
              onClick={changeLanguage(option)}
            />
          ))}
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

export default Header;
