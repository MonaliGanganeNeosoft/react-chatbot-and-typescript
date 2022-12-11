// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import { createStore } from "redux";
// import { Provider } from "react-redux";
// import store from "./State/store";
// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
import store from "./State/store";
// const initialState={Login:false,searchitem:'',uuid:'',cart:0}
// function Reducer(state=initialState,actions) {
//   switch (actions.type) {
//     case 'enable':
//       return {...state,Login:true,uuid:''}
//     case 'disable':
//       return {...state,Login:false,uuid:actions.payload}
//     case 'search':
//       return {...state,searchitem:actions.payload}
//       case 'cart':
//         return {...state,cart:actions.payload}
//     default:
//       return state;
//   }
// }
// const store=createStore(Reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__ ())
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
