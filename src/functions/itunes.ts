export const getImagesFromInput = async (input: string, callback: Function) => {
  const encodedInput = encodeURIComponent(input).replace(/%20/g, "+");

  let response = await fetch(
    `https://itunes.apple.com/search?term=${encodedInput}&entity=album&media=music`,
    {
      method: "GET",
    }
  );

  let json = await response.json();

  console.log(json);

  const results = json.results;

  const sources: string[] = [];
  results.forEach((result: any) => {
    let imgSrc: string = result.artworkUrl100;
    imgSrc = imgSrc.replace(/100x100/g, "200x200");
    if (!sources.includes(imgSrc)) sources.push(imgSrc);
  });

  callback(sources);
};
