/* eslint-disable no-console */
import '@testing-library/jest-dom/extend-expect';
import 'jest-localstorage-mock';
import './tests/initI18n';

import { toHaveNoViolations } from 'jest-axe';

import { server } from './tests/msw/server';

expect.extend(toHaveNoViolations);

// Mock scrollTo function
window.scrollTo = jest.fn();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const originalWarn = console.warn.bind(console.warn);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.warn = (msg: any, ...optionalParams: any[]) => {
  const msgStr = msg.toString();

  return (
    !msgStr.match(
      /Could not find the stylesheet to update with the ".*" selector!/i
    ) && originalWarn(msg, ...optionalParams)
  );
};

jest.setTimeout(1000000);
