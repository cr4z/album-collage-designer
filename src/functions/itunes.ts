export const getImagesFromInput = async (input: string, callback: Function) => {
  const encodedInput = encodeURIComponent(input).replace(/%20/g, "+");
  fetch("/log/--------");
  fetch("/log/1");

  const encodedReq = encodeURIComponent(
    `https://itunes.apple.com/search?term=${encodedInput}&entity=album&media=music`
  );

  const response = await fetch(`/proxy/${encodedReq}`, {
    method: "GET",
  });

  fetch("/log/2");

  const json = await response.json();

  fetch("/log/3");

  const results = json.results;

  const sources: string[] = [];
  results.forEach((result: any) => {
    let imgSrc: string = result.artworkUrl100;
    imgSrc = imgSrc.replace(/100x100/g, "200x200");
    if (!sources.includes(imgSrc)) sources.push(imgSrc);
  });

  fetch("/log/4");

  callback(sources);
};
