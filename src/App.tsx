import React from "react";
import "./App.css";
import ModalContextProvider from "./contexts/Modal";
import { ThemeProvider } from "@material-ui/core";
import { GlobalTheme } from "./themes/global";
import { UserFetcher } from "./components/UserFetcher";
//import { GridContainer } from "./components/GridContainer";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={GlobalTheme}>
        <ModalContextProvider>
          <header>🎨Album Collage Designer🖌️</header>
          <UserFetcher />
          {/*<GridContainer />*/}
        </ModalContextProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
