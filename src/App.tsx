import React from "react";
import "./App.css";
import ModalContextProvider from "./contexts/Modal";
import { ThemeProvider } from "@material-ui/core";
import { GlobalTheme } from "./themes/global";
import { GridContainer } from "./components/GridContainer";
//import { GridContainer } from "./components/GridContainer";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={GlobalTheme}>
        <ModalContextProvider>
          <header>🎨Album Collage Designer🖌️</header>
          <GridContainer />
        </ModalContextProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
