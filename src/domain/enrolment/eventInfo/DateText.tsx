import React from 'react';

import getDateRangeStr from '../../../utils/getDateRangeStr';

export interface DateTextProps {
  endTime: Date | null;
  startTime: Date | null;
}

const DateText: React.FC<DateTextProps> = ({ endTime, startTime }) => {
  const getText = () =>
    getDateRangeStr({ end: endTime, start: startTime, language: 'fi' });
  return <>{getText()}</>;
};

export default DateText;
