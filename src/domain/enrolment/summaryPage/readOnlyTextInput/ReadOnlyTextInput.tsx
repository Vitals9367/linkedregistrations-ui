import React, { FC } from 'react';

import styles from './readOnlyTextInput.module.scss';

interface Props {
  id: string;
  label: string;
  value: string;
}
const ReadOnlyTextInput: FC<Props> = ({ id, label, value }) => {
  return (
    <div className={styles.readOnlyTextInput}>
      <label htmlFor={id}>{label}</label>
      <input
        className={styles.input}
        id={id}
        name={id}
        readOnly
        value={value}
      />
    </div>
  );
};

export default ReadOnlyTextInput;
