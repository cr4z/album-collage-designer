import React, { createContext, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, TextField, ThemeProvider } from "@material-ui/core";
import { ModalTheme } from "../themes/modal";

interface IModalContext {
  setModalOpen: Function;
}

export const ModalContext = createContext<IModalContext | null>(null);

const ModalContextProvider = (props: any) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const state = {
    setModalOpen: setModalOpen,
  };

  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <ModalContext.Provider value={{ ...state }}>
      {modalOpen && (
        <ThemeProvider theme={ModalTheme}>
          <div className="modal-backdrop">
            <div className="modal-holder">
              <div className="modal">
                <div className="modal-header">
                  Add an album
                  <FontAwesomeIcon
                    className="modal-ex-btn"
                    onClick={() => setModalOpen(false)}
                    icon={faTimes}
                  />
                </div>
                <div className="modal-divider" />

                <TextField
                  fullWidth
                  placeholder="Search for an artist or album..."
                  variant="outlined"
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("asdf");
                      const btn = submitBtnRef.current;
                      if (btn) {
                        btn.click();
                      } else throw new Error("Submit button doesn't exist!");
                    }
                  }}
                />

                <div className="modal-divider" />
                <div className="modal-footer">
                  <Button
                    variant="contained"
                    disableElevation={true}
                    size="large"
                    ref={submitBtnRef}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      )}
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
