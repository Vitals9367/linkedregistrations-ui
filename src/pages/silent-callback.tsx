import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import SilentCallback from '../domain/auth/silentCallback/SilentCallback';

const SilentCallbackPage: NextPage = () => <SilentCallback />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default SilentCallbackPage;
