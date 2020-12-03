const { waitForImagesToLoad, stripImages } = require("./imgProcessing");
const Canvas = require("canvas");

const generateCanvas = async (imageSources, gridValues) => {
  const { numColumns, numRows } = gridValues;
  const maxColumnsRows = Math.max(numColumns, numRows);
  const cellSideLengthPxls = 3000 / maxColumnsRows;

  const images = imageSources.map((src) => {
    const img = new Canvas.Image();
    img.src = src;
    img.width = cellSideLengthPxls;
    img.height = cellSideLengthPxls;
    return img;
  });

  imageSources = stripImages(images);
  imageSources = await waitForImagesToLoad(images);

  const canvas = new Canvas.Canvas();
  canvas.width = cellSideLengthPxls * numColumns;
  canvas.height = cellSideLengthPxls * numRows;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    let total = -1;
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
        total++;
        ctx.drawImage(
          images[total],
          X(columnIndex, cellSideLengthPxls),
          Y(rowIndex, cellSideLengthPxls),
          cellSideLengthPxls,
          cellSideLengthPxls
        );
      }
    }
  } else throw new Error("No context produced!");

  return canvas;
};

function X(value, imageSize) {
  return value * imageSize;
}

function Y(value, imageSize) {
  return value * imageSize;
}

module.exports = generateCanvas;
