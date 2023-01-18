import classNames from 'classnames';
import { Fieldset as BaseFieldSet, FieldsetProps } from 'hds-react';
import React, { FC } from 'react';

import styles from './fieldset.module.scss';

const Fieldset: FC<FieldsetProps> = ({ children, className, ...props }) => {
  return (
    <BaseFieldSet className={classNames(className, styles.fieldset)} {...props}>
      {children}
    </BaseFieldSet>
  );
};

export default Fieldset;
