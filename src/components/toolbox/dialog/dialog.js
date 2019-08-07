import React from 'react';
import PropTypes from 'prop-types';
import DialogHolder from './holder';
import Title from './title';
import Description from './description';
import Options from './options';
import styles from './dialog.css';

const Dialog = ({ children, hasClose }) => (
  <div className={styles.wrapper}>
    {hasClose && (
      <span
        onClick={DialogHolder.hideDialog}
        className={styles.closeBtn}
      />
    )}
    {children}
  </div>
);

Dialog.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  hasClose: PropTypes.bool,
};

Dialog.defaultProps = {
  hasClose: false,
};

Dialog.displayName = 'Dialog';
Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Options = Options;

export default Dialog;
