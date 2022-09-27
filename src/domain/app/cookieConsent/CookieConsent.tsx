import { CookieModal } from 'hds-react';
import { FC, useState } from 'react';

import { PAGE_HEADER_ID } from '../../../constants';
import i18n from '../../../tests/initI18n';

type SupportedLanguage = 'en' | 'fi' | 'sv';

const translations = {
  enrolmentForm: {
    description: {
      en: 'The cookie required to save the enrolment form data',
      fi: 'Osallistumislomakkeen tietojen säilymiseksi vaadittu eväste',
      sv: 'Cookien som krävs för att spara deltagande formulär data',
    },
    name: {
      en: 'Enrolment form cookie',
      fi: 'Osallistumislomakkeen eväste',
      sv: 'Cookie för deltagande formulär',
    },
  },
  expiration: {
    session: {
      en: 'Session',
      fi: 'Istunto',
      sv: 'Session',
    },
  },
  siteName: {
    en: 'Linked Registrations',
    fi: 'Linked Registrations',
    sv: 'Linked Registrations',
  },
};

/* istanbul ignore next */
const origin = typeof window !== 'undefined' ? window.location.origin : '';

const CookieConsent: FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>(
    i18n.language as SupportedLanguage
  );

  const onLanguageChange = async (newLang: string) =>
    setLanguage(newLang as SupportedLanguage);

  return (
    <CookieModal
      contentSource={{
        siteName: translations.siteName[language],
        currentLanguage: language,
        requiredCookies: {
          groups: [
            {
              commonGroup: 'login',
              cookies: [{ commonCookie: 'tunnistamo' }],
            },
            {
              commonGroup: 'userInputs',
              cookies: [
                {
                  id: 'enrolmentForm',
                  hostName: origin,
                  name: translations.enrolmentForm.name[language],
                  description: translations.enrolmentForm.description[language],
                  expiration: translations.expiration.session[language],
                },
              ],
            },
          ],
        },
        optionalCookies: {
          groups: [
            {
              commonGroup: 'statistics',
              cookies: [{ commonCookie: 'matomo' }],
            },
          ],
        },
        language: { onLanguageChange },
        onAllConsentsGiven: (consents) => {
          if (consents.matomo) {
            //  start tracking
            // window._paq.push(['setConsentGiven']);
            // window._paq.push(['setCookieConsentGiven']);
          }
        },
        onConsentsParsed: (consents) => {
          /* istanbul ignore next */
          if (consents.matomo === undefined) {
            // tell matomo to wait for consent:
            // window._paq.push(['requireConsent']);
            // window._paq.push(['requireCookieConsent']);
          } else if (consents.matomo === false) {
            // tell matomo to forget conset
            // window._paq.push(['forgetConsentGiven']);
          }
        },

        focusTargetSelector: `#${PAGE_HEADER_ID}`,
      }}
    />
  );
};

export default CookieConsent;
