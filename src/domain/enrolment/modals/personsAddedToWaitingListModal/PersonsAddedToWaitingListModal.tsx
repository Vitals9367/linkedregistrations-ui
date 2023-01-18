import { Dialog, IconInfoCircle } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import Button from '../../../../common/components/button/Button';
import styles from '../../../../common/components/dialog/dialog.module.scss';

export interface PersonsAddedToWaitingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonsAddedToWaitingListModal: React.FC<
  PersonsAddedToWaitingListModalProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('enrolment');

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const id = 'persons-added-to-waiting-list-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="primary"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={t('personsAddedToWaitingListModal.title')}
      />
      <Dialog.Content>
        <p id={descriptionId}>{t('personsAddedToWaitingListModal.text')}</p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={handleClose} type="button" variant="primary">
          {t('personsAddedToWaitingListModal.buttonClose')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default PersonsAddedToWaitingListModal;
