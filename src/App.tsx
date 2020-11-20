import React from "react";
import { GridContainer } from "./components/Collage";
import "./App.css";
import ModalContextProvider from "./contexts/ModalContext";

function App() {
  return (
    <div className="App">
      <ModalContextProvider>
        <header>Album Collage Designer</header>
        <GridContainer />
      </ModalContextProvider>
    </div>
  );
}

export default App;
