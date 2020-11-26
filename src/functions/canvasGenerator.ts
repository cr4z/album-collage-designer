import { waitForImagesToLoad, stripImages } from "./imgProcessing";

export const generateCanvas = async (
  images: HTMLImageElement[],
  gridValues: { numColumns: number; numRows: number }
): Promise<HTMLCanvasElement> => {
  images = stripImages(images);

  images = await waitForImagesToLoad(images);

  const { numColumns, numRows } = gridValues;

  const numExtents = Math.max(numColumns, numRows);
  const imageSize = 3000 / numExtents;
  const canvas = document.createElement("canvas");
  canvas.width = imageSize * numColumns;
  canvas.height = imageSize * numRows;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    let total: number = -1;
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
        total++;
        ctx.drawImage(
          images[total],
          X(columnIndex, imageSize),
          Y(rowIndex, imageSize),
          imageSize,
          imageSize
        );
      }
    }
  } else throw new Error("No context produced!");

  return canvas;
};

function X(value: number, imageSize: number): number {
  return value * imageSize;
}

function Y(value: number, imageSize: number): number {
  return value * imageSize;
}
