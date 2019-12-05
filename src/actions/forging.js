import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';
import { getAPIClient } from '../utils/api/network';
import { tokenMap } from '../constants/tokens';
import voting from '../constants/voting';

export const displayForgedData = () => (dispatch, getState) => {
  const { latestBlocks } = getState().blocks;
  const numberOfForgedBlocksInRound = latestBlocks[0]
    && latestBlocks[0].height % voting.numberOfActiveDelegates;
  const forgedBlocksInRound = latestBlocks.slice(0, numberOfForgedBlocksInRound);
  const forgingData = forgedBlocksInRound.reduce((acc, block, idx) => {
    const forgingTime = Math.floor(idx * 10 / 60) !== 0
      ? `${Math.floor(idx * 10 / 60)} min ${(idx * 10) % 60} sec ago`
      : `${(idx * 10) % 60} sec ago`;

    return {
      ...acc,
      [block.generatorPublicKey]: {
        forgingTime,
        status: 'forgedThisRound',
      },
    };
  }, {});

  dispatch({
    type: actionTypes.displayForgedData,
    data: forgingData,
  });
};

export const fetchForgingData = () => (dispatch, getState) => {
  const { latestBlocks } = getState().blocks;
  const lastBlockHeight = latestBlocks[0] && latestBlocks[0].height;
  const forgedBlocksInRound = lastBlockHeight % voting.numberOfActiveDelegates;
  const apiClient = getAPIClient(tokenMap.LSK.key, getState());

  liskServiceApi.getNextForgers(apiClient, { limit: 100 }).then((response) => {
    const forgingData = response.reduce((acc, forger, idx) => {
      const forgingTime = Math.floor(idx * 10 / 60) !== 0
        ? `${Math.floor(idx * 10 / 60)} min ${(idx * 10) % 60} sec`
        : `${(idx * 10) % 60} sec`;
      return ({
        delegates: {
          ...acc.delegates,
          [forger.publicKey]: {
            forgingTime: idx < forgedBlocksInRound && forgingTime,
            status: idx < forgedBlocksInRound && 'forgedLastRound',
          },
        },
        nextForgers: idx < 10
          ? [...acc.nextForgers, { username: forger.username, address: forger.address }]
          : [...acc.nextForgers],
      });
    }, { delegates: {}, nextForgers: [] });
    dispatch({
      type: actionTypes.displayForgingData,
      data: forgingData,
    });
  });
};

export const concealForgingData = () => ({
  type: actionTypes.concealForgingData,
});
