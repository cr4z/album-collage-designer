export const getImagesFromInput = async (input: string, callback: Function) => {
  const encodedInput = encodeURIComponent(input);

  const response = await fetch(
    `https://genius.p.rapidapi.com/search?q=${encodedInput}&per_page=30`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "df21c1b749mshac0f907e51d8e2cp13ef4djsna9639bf0f0d3",
        "x-rapidapi-host": "genius.p.rapidapi.com",
      },
    }
  );

  const json = await response.json();

  const hits = json.response.hits;

  const sources: string[] = [];

  hits.forEach((hit: any) => {
    const albumSrc = hit.result.header_image_url;
    if (!sources.includes(albumSrc)) sources.push(albumSrc);
  });

  hits.forEach((hit: any) => {
    const songSrc = hit.result.song_art_image_url;
    if (!sources.includes(songSrc)) sources.push(songSrc);
  });

  callback(sources);
};
