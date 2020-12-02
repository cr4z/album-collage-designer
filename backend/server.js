const express = require("express");
const generateCanvas = require("./logic/generateCanvas");

//?
require("dotenv").config();

const app = express();
const port = 3001;

//?
app.use(express.json());

app.get("/test", (req, res) => {
  res.json("hello");
});

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

  res.json(url);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
