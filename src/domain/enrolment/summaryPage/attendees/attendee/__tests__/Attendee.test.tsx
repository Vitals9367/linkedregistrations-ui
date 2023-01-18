import React from 'react';

import { configure, render, screen } from '../../../../../../utils/testUtils';
import { ATTENDEE_INITIAL_VALUES } from '../../../../constants';
import Attendee, { AttendeeProps } from '../Attendee';

configure({ defaultHidden: true });

const attendee = ATTENDEE_INITIAL_VALUES;

const defaultProps: AttendeeProps = {
  attendee,
  attendeePath: '',
};

const renderComponent = (props?: Partial<AttendeeProps>) =>
  render(<Attendee {...defaultProps} {...props} />);

test('should not show in waiting list text if attendee is not in waiting list', async () => {
  renderComponent({ attendee: { ...attendee, inWaitingList: false } });

  expect(screen.queryByText('Varasija')).not.toBeInTheDocument();
});

test('should show in waiting list text if attendee is in waiting list', async () => {
  renderComponent({ attendee: { ...attendee, inWaitingList: true } });

  screen.getByText('Varasija');
});
