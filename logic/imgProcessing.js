const waitForImagesToLoad = async (images) => {
  const promises = [];
  images.map(async (image) => {
    promises.push(
      new Promise((resolve) => {
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

const stripImages = (images) => {
  images.map((image) => {
    image.crossOrigin = "anonymous";
    return image;
  });
  return images;
};

module.exports = { waitForImagesToLoad, stripImages };
