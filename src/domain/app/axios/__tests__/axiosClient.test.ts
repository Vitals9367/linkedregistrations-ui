import { TEST_API_TOKEN } from '../../../auth/constants';
import { setApiTokenToStorage } from '../../../auth/utils';
import axiosClient, { callDelete, callGet, callPost } from '../axiosClient';

const apiToken = TEST_API_TOKEN;

afterEach(() => {
  jest.clearAllMocks();
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

describe('callDelete', () => {
  it('should call axios delete without authorization header', async () => {
    const axiosDelete = jest.spyOn(axiosClient, 'delete').mockResolvedValue({});

    callDelete('/test/');

    expect(axiosDelete).toHaveBeenCalledTimes(1);
    expect(axiosDelete).toHaveBeenCalledWith('/test/', undefined);
  });

  it('should call axios delete with authorization header', async () => {
    const axiosDelete = jest.spyOn(axiosClient, 'delete').mockResolvedValue({});

    setApiTokenToStorage(apiToken);
    callDelete('/test/');

    expect(axiosDelete).toHaveBeenCalledTimes(1);
    expect(axiosDelete).toHaveBeenCalledWith('/test/', {
      headers: { Authorization: `bearer ${apiToken}` },
    });
  });
});

describe('callGet', () => {
  it('should call axios get without authorization header', async () => {
    const axiosGet = jest.spyOn(axiosClient, 'get').mockResolvedValue({});

    callGet('/test/');

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/test/', undefined);
  });

  it('should call axios get with authorization header', async () => {
    const axiosGet = jest.spyOn(axiosClient, 'get').mockResolvedValue({});

    setApiTokenToStorage(apiToken);
    callGet('/test/');

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/test/', {
      headers: { Authorization: `bearer ${apiToken}` },
    });
  });
});

describe('callPost', () => {
  it('should call axios post without authorization header', async () => {
    const axiosPost = jest.spyOn(axiosClient, 'post').mockResolvedValue({});

    callPost('/test/', 'data');

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith('/test/', 'data', undefined);
  });

  it('should call axios post with authorization header', async () => {
    const axiosPost = jest.spyOn(axiosClient, 'post').mockResolvedValue({});

    setApiTokenToStorage(apiToken);
    callPost('/test/', 'data');

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith('/test/', 'data', {
      headers: { Authorization: `bearer ${apiToken}` },
    });
  });
});
