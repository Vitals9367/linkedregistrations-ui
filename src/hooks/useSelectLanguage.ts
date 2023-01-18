import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import { SUPPORTED_LANGUAGES } from '../constants';
import { OptionType } from '../types';

type UseSelectLanguageState = {
  languageOptions: OptionType[];
  changeLanguage: (
    language: OptionType
  ) => (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

const useSelectLanguage = (): UseSelectLanguageState => {
  const { i18n, t } = useTranslation('common');
  const router = useRouter();

  const languageOptions: OptionType[] = React.useMemo(() => {
    return Object.values(SUPPORTED_LANGUAGES).map((language) => ({
      label: t(`navigation.languages.${language}`),
      value: language,
    }));
  }, [t]);

  const changeLanguage =
    (newLanguage: OptionType) =>
    async (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event?.preventDefault();
      await router.push(router.asPath, router.asPath, {
        locale: newLanguage.value,
      });
      i18n.changeLanguage(newLanguage.value);
    };

  return { changeLanguage, languageOptions };
};

export default useSelectLanguage;
