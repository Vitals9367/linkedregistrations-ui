import { userPathBuilder } from '../utils';

describe('userPathBuilder function', () => {
  it('should create correct path for user request', () => {
    expect(userPathBuilder({ username: '123' })).toBe('/user/123/');
  });
});
