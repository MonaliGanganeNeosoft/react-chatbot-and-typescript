import logo from "./logo.svg";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
function App() {
  const {
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  function callApi() {
    axios
      .get("http://localhost:4000/")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error.message));
  }
  async function callProtectedApi() {
    try {
      const token = await getAccessTokenSilently();
      //console.log(token);
      const response = await axios.get("http://localhost:4000/protected", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
    // axios;
    // .get("http://localhost:4000/protected")
    // .then((response) => console.log(response.data))
    // .catch((error) => console.log(error.message));
  }
  return (
    <div className="App">
      <h1>Auth 0 authentication</h1>
      <ul>
        <li>
          <button onClick={loginWithPopup}>Login with popup</button>
        </li>
        <li>
          <button onClick={loginWithRedirect}>Login with Redirect</button>
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
      <h3>User is {isAuthenticated ? "logeed in " : "not login"}</h3>
      <ul>
        <li>
          <button onClick={callApi}>call api route</button>
        </li>
        <li>
          <button onClick={callProtectedApi}>call protected api route</button>
        </li>
      </ul>
      {isAuthenticated && (
        <pre style={{ textAlign: "start" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
