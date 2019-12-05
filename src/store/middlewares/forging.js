import actionTypes from '../../constants/actions';
import { fetchForgingData } from '../../actions/forging';

const intervalTime = 5000;
let interval;

const forgingMiddleware = store => next => (action) => {
  switch (action.type) {
    case actionTypes.displayForgedData:
      // The 5-sec interval allows to catch missed blocks by delegates
      // before the next forging takes place
      next(action);
      store.dispatch(fetchForgingData());
      clearInterval(interval);
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
