import classNames from 'classnames';
import React from 'react';

import styles from './textWithIcon.module.scss';

interface Props {
  icon?: React.ReactNode;
  size?: 's' | 'm' | 'l';
  text: string | React.ReactNode;
}

const TextWithIcon: React.FC<Props> = ({ size = 'm', icon, text }) => {
  return (
    <div
      className={classNames(
        styles.textWithIcon,
        styles[`size${size.toUpperCase()}`]
      )}
    >
      {icon}
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default TextWithIcon;
