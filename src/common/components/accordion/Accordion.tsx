import { IconAngleDown, IconAngleUp } from 'hds-react';
import React, { useRef } from 'react';

import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import styles from './accordion.module.scss';

export interface AccordionProps {
  deleteButton?: React.ReactElement;
  id?: string;
  onClick: () => void;
  open: boolean;
  toggleButtonIcon?: React.ReactElement;
  toggleButtonLabel: string;
}

type ToggleButtonProps = {
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-label': string;
  id: string;
  onClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

type ContentProps = {
  'aria-label': string;
  id: string;
  style?: React.CSSProperties;
};

const Accordion: React.FC<React.PropsWithChildren<AccordionProps>> = ({
  children,
  deleteButton,
  id: _id,
  onClick,
  open,
  toggleButtonIcon,
  toggleButtonLabel,
}) => {
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const id = useIdWithPrefix({ id: _id, prefix: 'accordion-' });
  const contentId = `${id}-content`;
  const toggleId = `${id}-toggle`;

  const isEventFromIcon = (e: React.MouseEvent | React.KeyboardEvent) =>
    e.target instanceof Node && iconWrapperRef.current?.contains(e.target);

  const toggleButtonProps: ToggleButtonProps = {
    'aria-controls': contentId,
    'aria-expanded': open,
    'aria-label': toggleButtonLabel,
    id: toggleId,
    onClick: (e: React.MouseEvent) => {
      /* istanbul ignore else */
      if (!isEventFromIcon(e)) {
        onClick();
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      /* istanbul ignore else */
      if (e.key === 'Enter' && !isEventFromIcon(e)) {
        onClick();
      }
    },
  };

  const commonContentProps = { 'aria-label': toggleButtonLabel, id: contentId };
  const contentProps: ContentProps = open
    ? { ...commonContentProps }
    : { ...commonContentProps, style: { display: 'none' } };

  const icon = open ? (
    <IconAngleUp aria-hidden />
  ) : (
    <IconAngleDown aria-hidden />
  );

  return (
    <div className={styles.accordion}>
      <div className={styles.headingWrapper}>
        <div
          {...toggleButtonProps}
          className={styles.toggleButton}
          role="button"
          tabIndex={0}
        >
          <span aria-hidden={true}>{icon}</span>
          <span>
            {toggleButtonLabel}
            {toggleButtonIcon && (
              <div className={styles.iconWrapper} ref={iconWrapperRef}>
                {<div className={styles.separator}>–</div>}
                {toggleButtonIcon}
              </div>
            )}
          </span>
        </div>
        {deleteButton}
      </div>

      <div {...contentProps} className={styles.content} role="region">
        {open && children}
      </div>
    </div>
  );
};

export default Accordion;
