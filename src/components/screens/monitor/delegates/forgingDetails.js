import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './forgingDetails.css';
import { initialLSKSupply, tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';

const ForgingDetails = ({ t, networkStatus }) => {
  const totalForged = networkStatus && networkStatus.data.supply - initialLSKSupply;

  return (
    <Box>
      <BoxHeader>
        <h2>{t('Forging details')}</h2>
      </BoxHeader>
      <BoxContent>
        <div className={`${styles.contentWrapper} ${grid.row}`}>
          <div className={`${grid['col-sm-4']} ${styles.content}`}>
            <h3>{t('Total forged')}</h3>
            <div className={styles.totalForged}>
              {!!totalForged && (
              <div className={styles.totalForged}>
                <LiskAmount className="total-forged" val={totalForged} token={tokenMap.LSK.key} />
              </div>
              )}
            </div>
          </div>
          <div className={`${grid['col-sm-4']} ${styles.content}`}>
            <h3>{t('Next forgers')}</h3>
            <div className={styles.contentBody} />
          </div>
          <div className={`${grid['col-sm-4']} ${styles.content}`}>
            <h3>{t('Last forger')}</h3>
            <div className={styles.contentBody} />
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default ForgingDetails;
