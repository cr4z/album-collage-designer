import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ModalContext } from "../contexts/Modal";
import { setCssProps, waitForImagesToLoad } from "../functions/imgProcessing";
import { generateCanvas } from "../functions/canvasGenerator";
import { downloadCanvas } from "../functions/downloader";
import { Button, CircularProgress, TextField } from "@material-ui/core";

export function GridContainer() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Context not received!");

  const [inputNumColumns, setInputNumColumns] = useState<number>(5);
  const [inputNumRows, setInputNumRows] = useState<number>(10);
  const [officialNumColumns, setOfficialNumColumns] = useState<number>(5);
  const [officialNumRows, setOfficialNumRows] = useState<number>(10);

  const [gridIsLoading, setGridIsLoading] = useState<boolean>(false);
  const [downloadInProgress, setDownloadInProgress] = useState<boolean>(false);

  const [officialImages, setOfficialImages] = useState<HTMLImageElement[]>([]);
  const officialImagesRef = useRef<HTMLImageElement[]>();
  officialImagesRef.current = officialImages;

  const onGridInitialized = useCallback((initialImages: HTMLImageElement[]) => {
    setOfficialImages([...initialImages]);
  }, []);

  const onItemSet = useCallback((index: number, newSrc: string) => {
    const old = officialImagesRef.current;

    if (old) {
      const newImages = [...old];
      newImages[index].src = newSrc;

      //set the official image
      setOfficialImages(newImages);
    } else throw new Error("Ref was not assigned!");
  }, []);

  return (
    <>
      <div className="grid-text-field-container">
        <div className="input-fields-container">
          <div className="text-field">
            <TextField
              label="Columns"
              defaultValue="5"
              variant="outlined"
              onChange={(e) => setInputNumColumns(+e.target.value)}
            />
          </div>
          <div className="text-field">
            <TextField
              label="Rows"
              defaultValue="10"
              variant="outlined"
              onChange={(e) => setInputNumRows(+e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button
            disabled={gridIsLoading || downloadInProgress}
            size="large"
            onClick={() => {
              if (inputNumColumns * inputNumRows < 500) {
                setOfficialNumColumns(inputNumColumns);
                setOfficialNumRows(inputNumRows);
              } else alert("Can't go over 500 total cells!");
            }}
          >
            Set!
          </Button>
        </div>
      </div>

      <Grid
        onGridInitialized={onGridInitialized}
        gridValues={{
          numColumns: officialNumColumns,
          numRows: officialNumRows,
        }}
        gridState={{ gridIsLoading, setGridIsLoading }}
        onItemSet={(index: number, newSrc: string) => onItemSet(index, newSrc)}
      />

      <br />
      <div className="download-container">
        <div>
          <Button
            color="primary"
            size="large"
            disabled={gridIsLoading || downloadInProgress}
            onClick={() => {
              downloadButtonHandler(
                officialImages,
                {
                  numColumns: inputNumColumns,
                  numRows: inputNumRows,
                },
                setDownloadInProgress
              );
            }}
          >
            Download!
          </Button>
        </div>

        <div className="download-progress-spinner">
          {downloadInProgress && <CircularProgress />}
        </div>
      </div>
    </>
  );
}

const downloadButtonHandler = async (
  images: HTMLImageElement[],
  gridValues: { numColumns: number; numRows: number },
  setDownloadInProgress: Function
) => {
  setDownloadInProgress(true);

  const { numColumns, numRows } = gridValues;

  const canvas = await generateCanvas(images, {
    numColumns: numColumns,
    numRows: numRows,
  });

  downloadCanvas(canvas);

  setDownloadInProgress(false);
};

const Grid = (props: {
  gridValues: { numColumns: number; numRows: number };
  gridState: { gridIsLoading: any; setGridIsLoading: Function };
  onGridInitialized: Function;
  onItemSet: Function;
}) => {
  const { gridState } = props;
  const { numColumns, numRows } = props.gridValues;
  const total = numColumns * numRows;

  const [cellItems, setCellItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    //initialize grid; generate and assign CellItems

    gridState.setGridIsLoading(true);

    //generate new array of images
    const newImages: HTMLImageElement[] = [];
    for (let i = 0; i < total; i++) {
      const newImg = new Image();
      newImg.src = `https://picsum.photos/seed/${Math.random()}/1000`;
      newImages.push(newImg);
    }

    //init css
    setCssProps({ numColumns: numColumns, numRows: numRows });

    //wait for image array to load
    waitForImagesToLoad(newImages).then(() => {
      //generate new array of cellitems

      const newCellItems: JSX.Element[] = [];
      let i: number = -1;

      newImages.forEach((image) => {
        i++;

        const newItem = (
          <CellItem
            initialSource={image.src}
            index={i}
            onItemSet={(index: number, newSrc: string) =>
              props.onItemSet(index, newSrc)
            }
          />
        );

        newCellItems.push(newItem);
      });

      setCellItems(newCellItems);

      //finally, set grid state to not loading
      props.onGridInitialized(newImages);
      gridState.setGridIsLoading(false);
    });
  }, [numColumns, numRows]);

  return gridState.gridIsLoading ? (
    <CircularProgress color="secondary" style={{ margin: 100 }} />
  ) : (
    <div className="grid">{cellItems}</div>
  );
};

function CellItem(props: {
  initialSource: string;
  index: number;
  onItemSet: Function;
}) {
  const context = useContext(ModalContext);

  const [src, setSrc] = useState<string>(props.initialSource);

  const onImageReceieved = useCallback((newSource: string) => {
    setSrc(newSource);
    props.onItemSet(props.index, newSource);
  }, []);

  return (
    <img
      className="cell-item"
      src={src}
      alt="album cover"
      onClick={() => {
        if (context) {
          context.openModal(() => onImageReceieved);
        }
      }}
    ></img>
  );
}