import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  CircularProgress,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import { ModalTheme } from "../themes/modal";
import * as iTunes from "../functions/itunes";

interface IModalContext {
  openModal: Function;
}

interface ITagObject {
  elem: JSX.Element;
  label: string;
}

export const ModalContext = createContext<IModalContext | null>(null);

const ModalContextProvider = (props: any) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [gridCallback, setGridCallback] = useState<Function | null>(null);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [sources, setSources] = useState<string[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [tagObjects, setTagObjects] = useState<ITagObject[]>([]);
  const tagObjectsRef = useRef(tagObjects);
  tagObjectsRef.current = tagObjects;

  const onImagesReturned = useCallback((results: string[]) => {
    setSources(results);
    setLoadingResults(false);
  }, []);

  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  const ctx = {
    openModal: (inputCallback: Function) => {
      setModalOpen(true);
      setGridCallback((x: string) => inputCallback(x));
    },
  };

  const onImageSelected = useCallback(
    (src: string) => {
      if (gridCallback) {
        gridCallback(src);
        setModalOpen(false);
      } else {
        throw new Error("Callback doesn't exist!");
      }
    },
    [gridCallback]
  );

  const [pageInView, setPageInView] = useState<number>(0);
  const resultsPerPage = 6;
  const offset = pageInView * resultsPerPage;
  const results: JSX.Element[] = [];
  for (let i = 0; i < resultsPerPage; i++) {
    if (sources[i + offset]) {
      results.push(
        <Result src={sources[i + offset]} onImageSelected={onImageSelected} />
      );
    }
  }

  const prevPage = useCallback(() => {
    setPageInView(pageInView - 1);
  }, [pageInView]);

  const nextPage = useCallback(() => {
    setPageInView(pageInView + 1);
  }, [pageInView]);

  const addTag = useCallback((input: string) => {
    let labels = tagObjectsRef.current.map((a) => a.label);

    if (labels.includes(input)) return;
    if (tagObjectsRef.current.length > 8) return;

    const newElem = (
      <Tag
        label={input}
        onTagSearch={(label: string) => onTagSearch(label)}
        onTagDelete={(label: string) => onTagDelete(label)}
      />
    );

    const newTag = { elem: newElem, label: input };
    setTagObjects((old: any) => [...old, newTag]);
  }, []);

  const onTagSearch = useCallback((label: string) => {
    iTunes.getImagesFromInput(label, onImagesReturned);
    setPageInView(0);
  }, []);

  const onTagDelete = useCallback((label: string) => {
    const filtered: ITagObject[] = tagObjectsRef.current.filter(
      (tag) => label !== tag.label
    );
    setTagObjects(filtered);
  }, []);

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

                <div className="modal-search-bar">
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
                </div>

                <div className="tags-container">
                  {tagObjects.map((obj) => obj.elem)}
                </div>

                {sources.length > 0 ? (
                  <div className="modal-grid">{results}</div>
                ) : loadingResults ? (
                  <CircularProgress />
                ) : (
                  <span>{welcomeMessage}</span>
                )}

                <div className="modal-button-container">
                  <div>
                    <Button disabled={pageInView < 1} onClick={prevPage}>
                      👈
                    </Button>
                  </div>
                  <div>
                    <Button
                      disabled={results.length < resultsPerPage}
                      onClick={nextPage}
                    >
                      👉
                    </Button>
                  </div>
                </div>

                <div className="modal-divider" />
                <div className="modal-footer">
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation={true}
                    ref={submitBtnRef}
                    onClick={async () => {
                      addTag(input);
                      setSources([]);
                      setWelcomeMessage("Hm, nothing found :(");
                      setLoadingResults(true);
                      iTunes.getImagesFromInput(input, onImagesReturned);
                      setPageInView(0);
                    }}
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

function Tag(props: {
  label: string;
  onTagSearch: Function;
  onTagDelete: Function;
}) {
  const { label, onTagSearch, onTagDelete } = props;

  return (
    <span className="tag">
      <span className="tag-text" onClick={() => onTagSearch(label)}>
        {label}{" "}
      </span>
      <span onClick={() => onTagDelete(label)}>❌</span>
    </span>
  );
}

function Result(props: { src: string; onImageSelected: Function }) {
  return (
    <div className="modal-grid-result">
      <img
        onClick={() => props.onImageSelected(props.src)}
        width={200}
        height={200}
        src={props.src}
        alt="result"
      />
    </div>
  );
}

export default ModalContextProvider;
