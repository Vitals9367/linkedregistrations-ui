import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import EditEnrolmentPage from '../../../../../../domain/enrolment/EditEnrolmentPage';
import { prefetchEnrolmentQuery } from '../../../../../../domain/enrolment/query';
import { getSessionAndUser } from '../../../../../../utils/getSessionAndUser';
import prefetchRegistrationAndEvent from '../../../../../../utils/prefetchRegistrationAndEvent';

const EditEnrolment: NextPage = () => <EditEnrolmentPage />;

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

  try {
    await prefetchEnrolmentQuery(queryClient, {
      cancellationCode: query.accessCode as string,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

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

export default EditEnrolment;
