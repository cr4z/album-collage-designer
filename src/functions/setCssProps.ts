export const setCssProps = (gridValues: {
  numColumns: number;
  numRows: number;
}) => {
  const css = document.documentElement.style;
  const { numColumns, numRows } = gridValues;
  css.setProperty("--num-columns", numColumns.toString());
  css.setProperty("--num-rows", numRows.toString());
};
