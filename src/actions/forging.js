import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';
import { getAPIClient } from '../utils/api/network';
import { tokenMap } from '../constants/tokens';
import voting from '../constants/voting';

const getForgingTime = ({ idx, isInThePast }) => (
  Math.floor((idx * 10) / 60) !== 0
    ? `${Math.floor((idx * 10) / 60)} min ${(idx * 10) % 60} sec${isInThePast ? ' ago' : ''}`
    : `${(idx * 10) % 60} sec${isInThePast ? ' ago' : ''}`
);

export const fetchForgingData = () => async (dispatch, getState) => {
  const { latestBlocks } = getState().blocks;
  const numberOfForgedBlocksInRound = latestBlocks[0]
    && latestBlocks[0].height % voting.numberOfActiveDelegates;
  const forgedBlocksInRound = latestBlocks.slice(
    0,
    numberOfForgedBlocksInRound,
  );
  const numberOfRemainingBlocksInRound = voting.numberOfActiveDelegates
    - numberOfForgedBlocksInRound;
  const apiClient = getAPIClient(tokenMap.LSK.key, getState());
  const nextForgers = await liskServiceApi.getNextForgers(apiClient, {
    limit:
      numberOfRemainingBlocksInRound < 101 ? numberOfForgedBlocksInRound : 100,
  });
  const remainingForgers = nextForgers.slice(0, numberOfRemainingBlocksInRound);

  const forgedData = forgedBlocksInRound.reduce((acc, block, idx) => ({
    ...acc,
    delegates: {
      ...acc.delegates,
      [block.generatorPublicKey]: {
        forgingTime: getForgingTime({ idx, isInThePast: true }),
        status: 'forgedThisRound',
      },
    },
  }), { delegates: {} });


  const toForgeData = remainingForgers.reduce(
    (acc, forger, idx) => ({
      delegates: {
        ...acc.delegates,
        [forger.publicKey]: {
          forgingTime: idx < numberOfRemainingBlocksInRound && getForgingTime({ idx }),
          status: idx < numberOfRemainingBlocksInRound && 'forgedLastRound',
        },
      },
      nextForgers:
          idx < 10
            ? [
              ...acc.nextForgers,
              { username: forger.username, address: forger.address },
            ]
            : [...acc.nextForgers],
    }),
    { delegates: {}, nextForgers: [] },
  );

  dispatch({
    type: actionTypes.displayForgingData,
    data: {
      delegates: {
        ...forgedData.delegates,
        ...toForgeData.delegates,
      },
      nextForgers: toForgeData.nextForgers,
    },
  });
};

export const concealForgingData = () => ({
  type: actionTypes.concealForgingData,
});
