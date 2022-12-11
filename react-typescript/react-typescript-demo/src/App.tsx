import React from "react";
import "./App.css";
import Greet from "./components/Greet";

import Person from "./components/Person";
import PersonList from "./components/PersonList";
import Status from "./components/Status";

import { Heading } from "./components/Heading";
import Oscar from "./components/Oscar";
import Button from "./components/Button/Button";
import Input from "./components/Button/Input";
import Container from "./components/Button/Container";
import { LoggedIn } from "./components/state/LoggedIn";
import User from "./components/state/User";
import { Counter } from "./components/state/Counter";

import { ThemeContextProvider } from "./components/context/ThemeContext";
import Box from "./components/context/Box";

function App() {
  const personName = {
    first: "Moni",
    last: "gangane",
  };
  const nameList = [
    { first: "A", last: "a" },
    { first: "B", last: "b" },
    { first: "C", last: "c" },
  ];
  return (
    <>
      {/* <Greet name="monali" messageCount={20} isLoggedIn={false} /> */}
      <hr />
      <Person name={personName} />
      <hr />
      <PersonList names={nameList} />
      <hr />
      <Status status="loading" />
      <hr />
      <Heading>Placeholder head text</Heading>
      <hr />
      <Oscar>
        <Heading>Oscar goes to </Heading>
      </Oscar>
      <hr />
      <Greet name="monali" isLoggedIn={true} />
      <hr />
      <Button
        handleClick={(event, id) => {
          console.log("Button clicked", event, id);
        }}
      />
      <hr />
      <Input value="" handleChange={(event) => console.log(event)} />
      <hr />
      <div className="Appa">
        <Container styles={{ border: "1px solid red", padding: "1rem" }} />
      </div>
      <hr />
      <LoggedIn />
      <hr />
      <User />
      <hr />
      <Counter />
      <hr />
      <hr />
      <ThemeContextProvider>
        <Box />
      </ThemeContextProvider>
      <hr />
      <hr />

      <hr />
    </>
  );
}

export default App;
