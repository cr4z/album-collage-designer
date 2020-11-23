import React, { createContext, useCallback, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, TextField, ThemeProvider } from "@material-ui/core";
import { ModalTheme } from "../themes/modal";
import * as genius from "../functions/genius";

interface IModalContext {
  openModal: Function;
}

export const ModalContext = createContext<IModalContext | null>(null);

const ModalContextProvider = (props: any) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [gridCallback, setGridCallback] = useState<Function | null>(null);

  const [sources, setSources] = useState<string[]>([]);

  const onImagesReturned = useCallback((results: string[]) => {
    setSources(results);
  }, []);

  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  const ctx = {
    openModal: (inputCallback: Function) => {
      setModalOpen(true);
      setGridCallback(() => inputCallback);
    },
  };

  return (
    <ModalContext.Provider value={{ ...ctx }}>
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
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const btn = submitBtnRef.current;
                      if (btn) {
                        btn.click();
                      } else throw new Error("Submit button doesn't exist!");
                    }
                  }}
                />

                {sources.length > 0 && (
                  <div className="modal-grid">
                    {sources.map((source) => {
                      return <ModalItem src={source} />;
                    })}
                  </div>
                )}

                <div className="modal-divider" />
                <div className="modal-footer">
                  <Button
                    variant="contained"
                    disableElevation={true}
                    size="large"
                    ref={submitBtnRef}
                    onClick={async () =>
                      genius.getImagesFromInput(input, onImagesReturned)
                    }
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

function ModalItem(props: { src: string }) {
  return (
    <img width={100} height={100} src={props.src} alt="album suggestion" />
  );
}

export default ModalContextProvider;
