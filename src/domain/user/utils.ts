import { AxiosError } from 'axios';

import { callGet } from '../app/axios/axiosClient';
import { User, UserQueryVariables } from './types';

export const fetchUser = async (args: UserQueryVariables): Promise<User> => {
  try {
    const { data } = await callGet(userPathBuilder(args));
    return data;
  } catch (error) {
    /* istanbul ignore next */
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const userPathBuilder = (args: UserQueryVariables): string => {
  const { username } = args;

  return `/user/${username}/`;
};
