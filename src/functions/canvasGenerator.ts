import { stripImages, waitForImagesToLoad } from "./imgProcessing";

export const generateCanvas = async (
  images: HTMLImageElement[],
  gridValues: { numColumns: number; numRows: number }
): Promise<HTMLCanvasElement> => {
  alert(1);
  images = stripImages(images);

  alert(2);
  images = await waitForImagesToLoad(images);

  const { numColumns, numRows } = gridValues;

  const numExtents = Math.max(numColumns, numRows);
  const imageSize = 2000 / numExtents;
  const canvas = document.createElement("canvas");
  canvas.width = imageSize * numColumns;
  canvas.height = imageSize * numRows;
  const ctx = canvas.getContext("2d");

  alert("successfully loaded images");

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
