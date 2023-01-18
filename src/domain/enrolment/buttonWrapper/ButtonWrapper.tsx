import React, { FC, PropsWithChildren } from 'react';

import styles from './buttonWrapper.module.scss';

const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.buttonWrapper}>{children}</div>;
};

export default ButtonWrapper;
