import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './forgingDetails.css';
import { initialLSKSupply, tokenMap } from '../../../../constants/tokens';
import LiskAmount from '../../../shared/liskAmount';
import routes from '../../../../constants/routes';

const ForgingDetails = ({ t, networkStatus, nextForgers }) => {
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
            <div className={styles.contentBody}>
              {nextForgers && nextForgers.map((forger, i) => (
                <span key={forger.address}>
                  <Link className="next-forger" to={`${routes.accounts.path}/${forger.address}`}>
                    {forger.username}
                  </Link>
                  {i !== nextForgers.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
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
