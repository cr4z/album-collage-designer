import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../contexts/Modal";
import { stripImages, waitForImagesToLoad } from "../functions/imgProcessing";
import { generateCanvas } from "../functions/canvasGenerator";
import { downloadCanvas } from "../functions/downloader";
import { Button, TextField } from "@material-ui/core";

export function GridContainer() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Context not received!");

  const [numColumns, setNumColumns] = useState<number>(10);
  const [numRows, setNumRows] = useState<number>(5);
  const [gridIsLoading, setGridIsLoading] = useState<boolean>(false);

  const [officialImages, setOfficialImages] = useState<HTMLImageElement[]>([]);

  return (
    <>
      <div className="grid-text-fields">
        <span>
          <TextField
            label="Columns"
            defaultValue="10"
            variant="outlined"
            onChange={(e) => setNumColumns(+e.target.value)}
          />
        </span>
        <span>
          <TextField
            label="Rows"
            defaultValue="5"
            variant="outlined"
            onChange={(e) => setNumRows(+e.target.value)}
          />
        </span>
      </div>

      <Grid
        setOfficialImagesCb={setOfficialImages}
        gridValues={{ numColumns: numColumns, numRows: numRows }}
        gridState={{ gridIsLoading, setGridIsLoading }}
      />

      <br />
      <div className="grid-download-btn">
        <Button
          color="primary"
          size="large"
          disabled={gridIsLoading}
          onClick={() => {
            downloadButtonHandler(officialImages, {
              numColumns: numColumns,
              numRows: numRows,
            });
          }}
        >
          Download!
        </Button>
      </div>
    </>
  );
}

const downloadButtonHandler = async (
  images: HTMLImageElement[],
  gridValues: { numColumns: number; numRows: number }
) => {
  const { numColumns, numRows } = gridValues;

  images = await waitForImagesToLoad(images);
  images = stripImages(images);

  const canvas = await generateCanvas(images, {
    numColumns: numColumns,
    numRows: numRows,
  });

  downloadCanvas(canvas);
};

const Grid = (props: {
  gridValues: { numColumns: number; numRows: number };
  gridState: { gridIsLoading: any; setGridIsLoading: Function };
  setOfficialImagesCb: Function;
}) => {
  const { numColumns, numRows } = props.gridValues;
  const total = numColumns * numRows;

  const { gridIsLoading, setGridIsLoading } = props.gridState;

  const [images] = useState<HTMLImageElement[]>([]);
  const [cellItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setGridIsLoading(true);

    //generate array of images
    images.length = 0;
    for (let i = 0; i < total; i++) {
      const img = new Image();
      img.src = `https://picsum.photos/seed/${Math.random()}/1000`;
      images.push(img);
    }

    //init css
    setCssProps({ numColumns: numColumns, numRows: numRows });

    //wait for image array to load
    waitForImagesToLoad(images).then(() => {
      //generate array of cellitems
      cellItems.length = 0;
      images.forEach((image) => {
        cellItems.push(<CellItem src={image.src} />);
      });

      //finally, set grid state to not loading
      props.setOfficialImagesCb(images);
      setGridIsLoading(false);
    });
  }, [numColumns, numRows]);

  return gridIsLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="grid">{cellItems}</div>
  );
};

function CellItem(props: { src: string }) {
  const context = useContext(ModalContext);
  return (
    <img
      className="cell-item"
      src={props.src}
      alt="album cover"
      onClick={() => {
        if (context) {
          context.openModal(receiveData);
        } //error check this mf
      }}
    ></img>
  );
}

const setCssProps = (gridValues: { numColumns: number; numRows: number }) => {
  const css = document.documentElement.style;
  const { numColumns, numRows } = gridValues;
  css.setProperty("--num-columns", numColumns.toString());
  css.setProperty("--num-rows", numRows.toString());
};

function receiveData() {
}