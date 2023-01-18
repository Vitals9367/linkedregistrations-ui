import { EventTypeId, PublicationStatus } from '../../domain/event/constants';
import queryBuilder, { VariableToKeyItem } from '../queryBuilder';

describe('queryBuilder function', () => {
  const cases: [VariableToKeyItem[], string][] = [
    [[{ key: 'adminUser', value: true }], '?adminUser=true'],
    [
      [{ key: 'combinedText', value: ['text1', 'text2'] }],
      '?combinedText=text1,text2',
    ],
    [[{ key: 'createdBy', value: 'me' }], '?createdBy=me'],
    [
      [{ key: 'division', value: ['division1', 'division2'] }],
      '?division=division1,division2',
    ],
    [[{ key: 'end', value: '2020-12-12' }], '?end=2020-12-12'],
    [[{ key: 'endsAfter', value: '14' }], '?endsAfter=14'],
    [[{ key: 'endsBefore', value: '14' }], '?endsBefore=14'],
    [
      [{ key: 'eventType', value: [EventTypeId.Course, EventTypeId.General] }],
      '?eventType=Course,General',
    ],
    [
      [{ key: 'include', value: ['include1', 'include2'] }],
      '?include=include1,include2',
    ],
    [[{ key: 'inLanguage', value: 'fi' }], '?inLanguage=fi'],
    [[{ key: 'isFree', value: true }], '?isFree=true'],
    [[{ key: 'isFree', value: false }], '?isFree=false'],
    [
      [{ key: 'keyword', value: ['keyword1', 'keyword2'] }],
      '?keyword=keyword1,keyword2',
    ],
    [
      [{ key: 'keywordAnd', value: ['keyword1', 'keyword2'] }],
      '?keywordAnd=keyword1,keyword2',
    ],
    [
      [{ key: 'keywordNot', value: ['keyword1', 'keyword2'] }],
      '?keywordNot=keyword1,keyword2',
    ],
    [[{ key: 'language', value: 'fi' }], '?language=fi'],
    [
      [{ key: 'location', value: ['location1', 'location2'] }],
      '?location=location1,location2',
    ],
    [[{ key: 'page', value: 2 }], '?page=2'],
    [[{ key: 'pageSize', value: 10 }], '?pageSize=10'],
    [
      [{ key: 'publicationStatus', value: PublicationStatus.Draft }],
      '?publicationStatus=draft',
    ],
    [
      [{ key: 'publisher', value: ['publisher1', 'publisher2'] }],
      '?publisher=publisher1,publisher2',
    ],
    [[{ key: 'showAll', value: true }], '?showAll=true'],
    [[{ key: 'sort', value: 'start' }], '?sort=start'],
    [[{ key: 'start', value: '2020-12-12' }], '?start=2020-12-12'],
    [[{ key: 'startsAfter', value: '14' }], '?startsAfter=14'],
    [[{ key: 'startsBefore', value: '14' }], '?startsBefore=14'],
    [[{ key: 'superEvent', value: 'hel:123' }], '?superEvent=hel:123'],
    [
      [{ key: 'superEventType', value: ['type1', 'type2'] }],
      '?superEventType=type1,type2',
    ],
    [[{ key: 'text', value: 'text' }], '?text=text'],
    [[{ key: 'translation', value: 'fi' }], '?translation=fi'],
  ];

  it.each(cases)('return search query, result %p', (items, expectedQuery) =>
    expect(queryBuilder(items)).toBe(expectedQuery)
  );
});
