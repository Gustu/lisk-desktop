import actionTypes from '../../constants/actions';
import { fetchForgingData } from '../../actions/forging';

const intervalTime = 5000;
let interval;

const forgingMiddleware = store => next => (action) => {
  switch (action.type) {
    case actionTypes.displayForgingData:
      // Starts interval to call nextForgers endpoint every 5 seconds - UNTESTED
      // The 5-sec interval allows to catch missed blocks by delegates
      // before the next forging takes place
      next(action);
      clearInterval(interval);
      // TODO: Fix TypeError
      interval = setInterval(() => store.dispatch(fetchForgingData()), intervalTime);
      break;
    case actionTypes.concealForgingData:
      next(action);
      clearInterval(interval);
      break;
    default:
      next(action);
      break;
  }
};

export default forgingMiddleware;
