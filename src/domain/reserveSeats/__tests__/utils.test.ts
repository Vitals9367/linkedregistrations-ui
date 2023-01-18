import { getRegistrationTimeLeft } from '../utils';

describe('getRegistrationTimeLeft function', () => {
  it('should return 0 if data is null', () => {
    expect(getRegistrationTimeLeft(null)).toEqual(0);
  });
});
