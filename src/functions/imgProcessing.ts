export const waitForImagesToLoad = async (
  images: HTMLImageElement[]
): Promise<HTMLImageElement[]> => {
  const promises: Promise<any>[] = [];
  images.map(async (image: HTMLImageElement) => {
    promises.push(
      new Promise<void>((resolve) => {
        if (image.complete) {
          if (!(image.naturalWidth === 0)) {
            if (!(image.naturalHeight === 0)) {
              //image completely loaded
              resolve();
            }
          }
        } else {
          image.onload = () => {
            resolve();
          };
        }
      })
    );
  });

  await Promise.allSettled(promises);

  return images;
};

export const stripImages = (images: HTMLImageElement[]): HTMLImageElement[] => {
  images.map((image) => {
    image.crossOrigin = "anonymous";
    return image;
  });
  return images;
};

export const setCssProps = (gridValues: { numColumns: number; numRows: number }) => {
  const css = document.documentElement.style;
  const { numColumns, numRows } = gridValues;
  css.setProperty("--num-columns", numColumns.toString());
  css.setProperty("--num-rows", numRows.toString());
};