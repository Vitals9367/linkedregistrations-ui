import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ReservationTimeExpiredModal, {
  ReservationTimeExpiredModalProps,
} from '../ReservationTimeExpiredModal';

configure({ defaultHidden: true });

const defaultProps: ReservationTimeExpiredModalProps = {
  isOpen: true,
  onTryAgain: jest.fn(),
};

const renderComponent = (props: Partial<ReservationTimeExpiredModalProps>) =>
  render(<ReservationTimeExpiredModal {...defaultProps} {...props} />);

test('should call onTryAgain', async () => {
  const onTryAgain = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onTryAgain });

  const tryAgainButton = screen.getByRole('button', {
    name: 'Yritä uudelleen',
  });
  await act(async () => await user.click(tryAgainButton));
  expect(onTryAgain).toBeCalled();
});
