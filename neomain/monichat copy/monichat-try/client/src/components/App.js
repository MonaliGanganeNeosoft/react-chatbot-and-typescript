import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Shop from "./Shop/Shop";
import Header from "../Header";
import Chatbot from "./Chatbot/Chatbot";
function app() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/shop" element={<Shop />} />
          </Routes>
          <Chatbot />
        </div>
      </Router>
    </>
  );
}

export default app;
