import axios, { AxiosRequestConfig } from 'axios';

import { LINKED_EVENTS_URL } from '../../../constants';
import { getApiTokenFromStorage } from '../../auth/utils';

const axiosClient = axios.create({
  baseURL: LINKED_EVENTS_URL,
  headers: { 'Content-Type': 'application/json' },
});

const getRequestConfig = (
  config?: AxiosRequestConfig
): AxiosRequestConfig | undefined => {
  const token = getApiTokenFromStorage();

  return token
    ? {
        ...config,
        headers: { ...config?.headers, Authorization: `bearer ${token}` },
      }
    : config;
};

export const callDelete = (url: string, config?: AxiosRequestConfig) => {
  return axiosClient.delete(url, getRequestConfig(config));
};

export const callGet = (url: string, config?: AxiosRequestConfig) => {
  return axiosClient.get(url, getRequestConfig(config));
};

export const callPost = (
  url: string,
  data: string,
  config?: AxiosRequestConfig
) => {
  return axiosClient.post(url, data, getRequestConfig(config));
};

export default axiosClient;
