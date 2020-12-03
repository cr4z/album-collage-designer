const generateCanvas = require("./logic/generateCanvas");
const fetch = require("node-fetch");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, "build", "index.html"))
);

app.get("/generateCanvas/:columns/:rows/:encodedJson", async (req, res) => {
  const columns = req.params.columns;
  const rows = req.params.rows;

  const json = decodeURIComponent(req.params.encodedJson);
  const imageSources = JSON.parse(json);

  const canvas = await generateCanvas(imageSources, {
    numColumns: columns,
    numRows: rows,
  });

  const url = canvas.toDataURL();

  res.json(url); //write streams response
  console.log("served url!");
});

app.get("/proxy/:request", async (req, res) => {
  const encodedRequest = req.params.request;
  const unencryptedRequest = decodeURIComponent(encodedRequest);
  const result = await fetch(unencryptedRequest, {
    method: "GET",
  });

  const json = await result.json();

  res.json(json);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
