import actionTypes from '../constants/actions';
import liskServiceApi from '../utils/api/lsk/liskService';

const fetchForgingData = () => (dispatch, getState) => {
  liskServiceApi.getNextForgers().then((response) => {
    const normalizedData = response.data.reduce((acc, key) => {
      // TODO: Change status timestamp format
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
