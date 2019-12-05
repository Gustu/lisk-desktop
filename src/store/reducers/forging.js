import actionTypes from '../../constants/actions';

const forging = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.displayForgingData:
      return {
        ...state,
        ...action.data,
      };
    case actionTypes.displayForgedData:
      return {
        ...state,
        delegates: action.data,
      };
    default:
      return state;
  }
};

export default forging;
