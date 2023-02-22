import getConfig from 'next/config';

const {
  publicRuntimeConfig: { linkedEventsApiBaseUrl },
} = getConfig();

const generateAtId = (id: string, endpoint: string): string => {
  if (!linkedEventsApiBaseUrl) {
    throw new Error(
      'Invalid configuration. Linked Events API base url missing'
    );
  }

  return `${linkedEventsApiBaseUrl}/${endpoint}/${id}/`;
};

export default generateAtId;
