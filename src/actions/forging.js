import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';
import { getAPIClient } from '../utils/api/network';
import { tokenMap } from '../constants/tokens';

export const fetchForgingData = () => (dispatch, getState) => {
  const apiClient = getAPIClient(tokenMap.LSK.key, getState());
  liskServiceApi.getNextForgers(apiClient).then((response) => {
    const normalizedData = response.reduce((acc, key, idx) => {
      // TODO: What if state.blocks is empty?
      const lastBlockForged = getState().blocks.latestBlocks
        .find(block => block.generatorPublicKey === key.publicKey);

      return {
        delegates: {
          ...acc.delegates,
          [key.username]: {
            lastBlockHeight: lastBlockForged && lastBlockForged.height,
            lastBlockTimestamp: lastBlockForged && lastBlockForged.timestamp,
            // TODO: Get forgingTime
            forgingTime: undefined,
          },
        },
        nextForgers: idx < 10 ? [...acc.nextForgers, key.username] : [...acc.nextForgers],
      };
    }, { delegates: {}, nextForgers: [] });
    dispatch({
      type: actionTypes.displayForgingData,
      data: normalizedData,
    });
  });
};

export const concealForgingData = () => ({
  type: actionTypes.concealForgingData,
});
