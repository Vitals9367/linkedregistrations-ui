import getConfig from 'next/config';

const getServerRuntimeConfig = () => {
  const {
    serverRuntimeConfig: {
      env,
      oidcApiTokensUrl,
      oidcClientId,
      oidcClientSecret,
      oidcIssuer,
      oidcLinkedEventsApiScope,
      oidcTokenUrl,
    },
  } = getConfig();

  if (
    !env ||
    !oidcApiTokensUrl ||
    !oidcClientId ||
    !oidcClientSecret ||
    !oidcIssuer ||
    !oidcLinkedEventsApiScope ||
    !oidcTokenUrl
  ) {
    throw new Error(
      `Invalid configuration. Some required server runtime variable are missing. \nenv:${env} \noidcApiTokensUrl:${oidcApiTokensUrl} \noidcClientId:${oidcClientId} \noidcClientSecret:${oidcClientSecret} \noidcIssuer:${oidcIssuer} \noidcLinkedEventsApiScope:${oidcLinkedEventsApiScope} oidcTokenUrl:${oidcTokenUrl}`
    );
  }

  return {
    env,
    oidcApiTokensUrl,
    oidcClientId,
    oidcClientSecret,
    oidcIssuer,
    oidcLinkedEventsApiScope,
    oidcTokenUrl,
  };
};

export default getServerRuntimeConfig;
