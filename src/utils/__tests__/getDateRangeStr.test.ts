import getDateRangeStr from '../getDateRangeStr';

describe('getDateRangeStr function', () => {
  it('should return date range in correct format', () => {
    expect(getDateRangeStr({ start: null, end: null, language: 'fi' })).toBe(
      ''
    );
    expect(
      getDateRangeStr({
        start: null,
        end: new Date('2019-12-03T08:42:36.318755Z'),
        language: 'fi',
      })
    ).toBe('– 3.12.2019, 10.42');
    expect(
      getDateRangeStr({
        start: new Date('2019-12-03T08:42:36.318755Z'),
        end: null,
        language: 'fi',
      })
    ).toBe('3.12.2019, 10.42 –');
    expect(
      getDateRangeStr({
        start: new Date('2019-12-03T08:42:36.318755Z'),
        end: null,
        language: 'en',
      })
    ).toBe('3.12.2019, 10:42 AM –');
    expect(
      getDateRangeStr({
        start: new Date('2019-12-03T08:42:36.318755Z'),
        end: new Date('2019-12-03T10:42:36.318755Z'),
        language: 'fi',
      })
    ).toBe('3.12.2019, 10.42 – 12.42');
    expect(
      getDateRangeStr({
        start: new Date('2019-12-03T08:42:36.318755Z'),
        end: new Date('2019-12-13T10:42:36.318755Z'),
        language: 'fi',
      })
    ).toBe('3 – 13.12.2019');
    expect(
      getDateRangeStr({
        start: new Date('2019-11-03T08:42:36.318755Z'),
        end: new Date('2019-12-13T10:42:36.318755Z'),
        language: 'fi',
      })
    ).toBe('3.11 – 13.12.2019');
    expect(
      getDateRangeStr({
        start: new Date('2019-11-03T08:42:36.318755Z'),
        end: new Date('2020-12-13T10:42:36.318755Z'),
        language: 'fi',
      })
    ).toBe('3.11.2019 – 13.12.2020');
  });
});
