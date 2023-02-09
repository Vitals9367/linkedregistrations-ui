import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import EnrolmentCancelledPage from '../../../../../domain/enrolment/EnrolmentCancelledPage';
import { getSessionAndUser } from '../../../../../utils/getSessionAndUser';
import prefetchRegistrationAndEvent from '../../../../../utils/prefetchRegistrationAndEvent';

const EnrolmentCancelled: NextPage = () => <EnrolmentCancelledPage />;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const queryClient = new QueryClient();
  const { session } = await getSessionAndUser(queryClient, {
    req,
    res,
  });

  await prefetchRegistrationAndEvent({
    query,
    queryClient,
    req,
    res,
    shouldPrefetchPlace: false,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        'common',
        'enrolment',
      ])),
      dehydratedState: dehydrate(queryClient),
      session,
    },
  };
};

export default EnrolmentCancelled;
