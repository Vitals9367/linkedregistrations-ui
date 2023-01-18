import React, { FC, PropsWithChildren } from 'react';

import styles from './formContainer.module.scss';

const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.formContainer}>{children}</div>;
};

export default FormContainer;
