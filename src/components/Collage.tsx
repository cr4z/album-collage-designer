import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { stripImages, waitForImagesToLoad } from "../functions/imgProcessing";
import { generateCanvas } from "../functions/canvasGenerator";
import { downloadCanvas } from "../functions/downloader";

export function GridContainer() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Context not received!");

  const [numColumns, setNumColumns] = useState<number>(10);
  const [numRows, setNumRows] = useState<number>(5);
  const [gridIsLoading, setGridIsLoading] = useState<boolean>(false);

  const setModalOpen = ctx.setModalOpen;

  const [officialImages, setOfficialImages] = useState<HTMLImageElement[]>([]);

  return (
    <>
      <span>
        Columns: <input onChange={(e) => setNumColumns(+e.target.value)} />{" "}
      </span>
      <span>
        Rows: <input onChange={(e) => setNumRows(+e.target.value)} />{" "}
      </span>
      <br />

      <Grid
        setOfficialImages={setOfficialImages}
        gridValues={{ numColumns: numColumns, numRows: numRows }}
        gridState={{ gridIsLoading, setGridIsLoading }}
      />

      <br />
      <button
        disabled={gridIsLoading}
        onClick={() => {
          downloadButtonHandler(officialImages, {
            numColumns: numColumns,
            numRows: numRows,
          });
        }}
      >
        Download!
      </button>
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
  setOfficialImages: Function;
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
      setGridIsLoading(false);

      props.setOfficialImages(images);
    });
  }, [numColumns, numRows]);

  return gridIsLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="grid">{cellItems}</div>
  );
};

function CellItem(props: { src: string }) {
  const x = useContext(ModalContext);
  return (
    <img
      className="cell-item"
      src={props.src}
      alt="album cover"
      onClick={() => {
        x?.setModalOpen(true);
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
