import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';
import { getAPIClient } from '../utils/api/network';
import { tokenMap } from '../constants/tokens';

const fetchForgingData = () => (dispatch, getState) => {
  const apiClient = getAPIClient(tokenMap.LSK.key, getState());
  liskServiceApi.getNextForgers(apiClient).then((response) => {
    const normalizedData = response.data.reduce((acc, key) => {
      // TODO: Change status timestamp format
      // TODO: What if state.blocks is empty?
      const status = getState().blocks
        .find(block => block.generatorPublicKey === key.publicKey).timestamp;
      return {
        ...acc,
        [key.username]: {
          status,
          // TODO: Get forgingTime
          forgingTime: undefined,
        },
      };
    }, {});
    dispatch({
      type: actionTypes.displayForgingData,
      data: normalizedData,
    });
  });
};

export default fetchForgingData;
