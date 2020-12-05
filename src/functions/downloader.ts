export const downloadImageFromURL = (url: string) => {
  const myWindow = window.open("", "MsgWindow", "width=200,height=100");
  if (!myWindow) throw new Error("Window doesn't exist!");

  const link = myWindow.document.createElement("a");
  link.href = url;
  link.download = "album-collage-designer.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
};