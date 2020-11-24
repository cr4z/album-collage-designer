export const getImagesFromInput = async (input: string, callback: Function) => {
  const encodedInput = encodeURIComponent(input);

  //you can add autocomplete!
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${encodedInput}`,
    {
      method: "GET",
    }
  );

  const json = await response.json();

  const hits = json.data;

  const sources: string[] = [];
  hits.forEach((hit: any) => {
    const songSrc = hit.album.cover_xl;
    if (!sources.includes(songSrc)) sources.push(songSrc);
  });

  callback(sources);
};
