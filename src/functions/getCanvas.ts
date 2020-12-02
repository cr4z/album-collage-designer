export const getCanvas = async (
  gridValues: { numColumns: number; numRows: number },
  imageSources: string[]
): Promise<string> => {
  const { numColumns, numRows } = gridValues;

  const json = JSON.stringify(imageSources);
  const encodedJson = encodeURIComponent(json);

  let res: string = "";

  await fetch(`/generateCanvas/${numColumns}/${numRows}/${encodedJson}`)
    .then((res) => res.json())
    .then((result) => {
      res = result;
    });

  return res;
};
