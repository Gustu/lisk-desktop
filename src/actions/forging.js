import moment from 'moment';
import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';
import { getAPIClient } from '../utils/api/network';
import { tokenMap } from '../constants/tokens';
import voting from '../constants/voting';

const getForgingStatus = (lastBlockForged) => {
  if (lastBlockForged) {
    const roundStartHeight = lastBlockForged.height
      - (lastBlockForged.height % voting.numberOfActiveDelegates)
      + 1;
    const statusRanges = [
      {
        min: Number.NEGATIVE_INFINITY,
        max: roundStartHeight - voting.numberOfActiveDelegates * 2,
        status: 'notForging',
      },
      {
        min: roundStartHeight - voting.numberOfActiveDelegates * 2,
        max: roundStartHeight - voting.numberOfActiveDelegates,
        status: 'missedLastRound',
      },
      {
        min: roundStartHeight - voting.numberOfActiveDelegates,
        max: roundStartHeight,
        status: 'forgedLastRound',
      },
      {
        min: roundStartHeight,
        max: Number.POSITIVE_INFINITY,
        status: 'forgedThisRound',
      },
    ];
    return statusRanges.find(
      ({ min, max }) => min <= lastBlockForged.height && lastBlockForged.height < max,
    ).status;
  }
  return undefined;
};

export const fetchForgingData = () => (dispatch, getState) => {
  const apiClient = getAPIClient(tokenMap.LSK.key, getState());
  liskServiceApi.getNextForgers(apiClient, { limit: 100 }).then((response) => {
    const normalizedData = response.reduce((acc, key, idx) => {
      const lastBlockForged = getState().blocks.latestBlocks
        .find(block => block.generatorPublicKey === key.publicKey);

      return {
        delegates: {
          ...acc.delegates,
          [key.publicKey]: {
            lastBlockHeight: lastBlockForged && lastBlockForged.height,
            lastBlockTimestamp: lastBlockForged && lastBlockForged.timestamp,
            username: key.username,
            status: getForgingStatus(lastBlockForged),
            forgingTime: moment().add(idx * 10, 'seconds'),
          },
        },
        nextForgers: idx < 10
          ? [...acc.nextForgers, { username: key.username, address: key.address }]
          : [...acc.nextForgers],
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
