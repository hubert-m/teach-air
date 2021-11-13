import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import RootReducer from './RootReducer';

const devTools = process.env.REACT_APP_REDUX_DEV_TOOLS_ENABLED || false;

export const prepareStore = preloadedState => {
  return createStore(
    RootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunkMiddleware),
      devTools && window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f,
    ),
  );
};
