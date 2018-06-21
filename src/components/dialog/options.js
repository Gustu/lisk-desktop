import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, RedButton } from '../toolbox/buttons/button';

import styles from './options.css';

const Options = ({ firstButton, secondButton, text, title }) =>
  (<div className={styles.optionsBody}>
    <div className={styles.title}>{title}</div>
    <br />
    <p className={styles.text}>{text}</p>
    <br />
    <section className={`${grid.row} ${styles.buttonsRow} ${grid['between-xs']}`}>
      <Button label={firstButton.text} onClick={firstButton.onClickHandler} className='ok-button' />
      <RedButton label={secondButton.text} onClick={secondButton.onClickHandler} className='ok-button'/>
    </section>
  </div>);

export default translate()(Options);
