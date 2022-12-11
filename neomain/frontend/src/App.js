import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Component/Home";
import RegisterPage from "./Component/RegisterPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route path="/" element={<RegisterPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
