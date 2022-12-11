const { applyMiddleware } = require("redux");
const redux = require("redux");
const reduxLogger = require("redux-logger");

const createStore = redux.createStore;
const combineReducers = redux.combineReducers;

const apllyMiddleware = redux.applyMiddleware;
const logger = reduxLogger.createLogger();
const BUY_CAKE = "BUY_CAKE";
const BUY_ICECREAM = "BUY_ICECREAM";
function buycake() {
  return {
    type: BUY_CAKE,
  };
}
function buyIcecream() {
  return {
    type: BUY_ICECREAM,
  };
}
const initalCakeState = { numOfCake: 10 };
const initalIceState = { numofIcecrame: 20 };
const cakeReducer = (state = initalCakeState, action) => {
  switch (action.type) {
    case BUY_CAKE:
      return { ...state, numOfCake: state.numOfCake - 1 };
    default:
      return state;
  }
};
const iceReducer = (state = initalIceState, action) => {
  switch (action.type) {
    case BUY_ICECREAM:
      return { ...state, numofIcecrame: state.numofIcecrame - 1 };
    default:
      return state;
  }
};
const rootReducers = combineReducers({
  cake: cakeReducer,
  icecrame: iceReducer,
});
const store = createStore(rootReducers, applyMiddleware(logger));
console.log("Initial state", store.getState());
const unsubscribe = store.subscribe(() => {});
store.dispatch(buycake());
store.dispatch(buycake());
store.dispatch(buycake());
store.dispatch(buyIcecream());
store.dispatch(buyIcecream());
unsubscribe();
