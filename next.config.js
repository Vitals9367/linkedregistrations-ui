/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const { i18n } = require('./next-i18next.config');

const moduleExports = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['src/styles'],
  },
  sentry: {
    hideSourceMaps: true,
  },
  publicRuntimeConfig: {
    linkedEventsApiBaseUrl: process.env.NEXT_PUBLIC_LINKED_EVENTS_URL,
  },
  serverRuntimeConfig: {
    env: process.env.NEXT_ENV,
    oidcApiTokensUrl: process.env.OIDC_API_TOKENS_URL,
    oidcClientId: process.env.OIDC_CLIENT_ID,
    oidcClientSecret: process.env.OIDC_CLIENT_SECRET,
    oidcIssuer: process.env.OIDC_ISSUER,
    oidcLinkedEventsApiScope: process.env.OIDC_LINKED_EVENTS_API_SCOPE,
    oidcTokenUrl: process.env.OIDC_TOKEN_URL,
  },
  output: 'standalone',
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
