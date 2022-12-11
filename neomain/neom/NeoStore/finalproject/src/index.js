import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createStore} from 'redux'
import { Provider } from 'react-redux';
import store from './State/store'
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
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
