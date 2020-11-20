export const downloadCanvas = (canvas: HTMLCanvasElement) => {
  const url = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = url;
  link.download = "album-collage-designer.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
};
