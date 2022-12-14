// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";
// import * as serviceWorker from "./serviceWorker";
// import { GithubProvider } from "./context/context";
// import { Auth0Provider } from "@auth0/auth0-react";
// //dev-a3vlyj5s.us.auth0.com
// //c9ZRwcPZybF6EBc7GnNPmIqbmnDxC1iL
// //http://localhost:3000

// ReactDOM.render(
//   <React.StrictMode>
//     <Auth0Provider
//       domain="dev-a3vlyj5s.us.auth0.com"
//       clientId="c9ZRwcPZybF6EBc7GnNPmIqbmnDxC1iL"
//       redirectUri={window.location.origin}
//       cacheLocation="localstorage"
//     >
//       <GithubProvider>
//         <App />
//       </GithubProvider>
//     </Auth0Provider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GithubProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-pu8wyk-g.us.auth0.com"
      clientId="GYsVn60CkUU6fa4yiwpRrT1KVL5KuzPh"
      redirectUri={window.location.origin}
      cacheLocation="localstorage"
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
