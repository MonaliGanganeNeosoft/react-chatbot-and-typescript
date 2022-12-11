import { useReducer } from "react";

type CounterState = {
  count: number;
};
type UpdateAction = {
  type: "incr" | "decr";
  payload: number;
};
type ResetAction = {
  type: "reset";
};
type CounterAction = UpdateAction | ResetAction;

// type CounterAction = {
//   type: "incr" | "decr" | "reset";
//   payload?: number;
// };
const intialState = { count: 0 };

function reducer(state: CounterState, action: CounterAction) {
  switch (action.type) {
    case "incr":
      return { count: state.count + action.payload };
    case "decr":
      return { count: state.count - action.payload };
    case "reset":
      return intialState;
    default:
      return state;
  }
}
export const Counter = () => {
  const [state, dispatch] = useReducer(reducer, intialState);
  return (
    <>
      Count:{state.count}
      <button onClick={() => dispatch({ type: "incr", payload: 10 })}>
        Increment as 10
      </button>
      <button onClick={() => dispatch({ type: "decr", payload: 10 })}>
        Decrement as 10
      </button>
      <button onClick={() => dispatch({ type: "reset" })}>reset</button>
    </>
  );
};
