import React from "react";
import { GridContainer } from "./components/GridContainer";
import "./App.css";
import ModalContextProvider from "./contexts/Modal";
import { ThemeProvider } from "@material-ui/core";
import { GlobalTheme } from "./themes/global";

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
