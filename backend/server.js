const express = require("express");
//const generateCanvas = require("./logic/generateCanvas");
//const fetch = require("node-fetch");

var app = express();
var server = require("http").Server(app);
server.listen(80);

var port = process.env.PORT || 3000;
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(port, function () {
  console.log("Node app is running at localhost:" + app.get("port"));
});

// //?
// require("dotenv").config();

// const app = express();
// const port = 3001;

// //?
// app.use(express.json());

// app.get("/log/:msg", (req, res) => {
//   console.log(req.params.msg);
// });

// app.get("/generateCanvas/:columns/:rows/:encodedJson", async (req, res) => {
//   const columns = req.params.columns;
//   const rows = req.params.rows;

//   const json = decodeURIComponent(req.params.encodedJson);
//   const imageSources = JSON.parse(json);

//   const canvas = await generateCanvas(imageSources, {
//     numColumns: columns,
//     numRows: rows,
//   });

//   const url = canvas.toDataURL();

//   res.json(url); //write streams response
//   console.log("served url!");
// });

// app.get("/proxy/:request", async (req, res) => {
//   const encodedRequest = req.params.request;
//   const unencryptedRequest = decodeURIComponent(encodedRequest);
//   const result = await fetch(unencryptedRequest, {
//     method: "GET",
//   });

//   const json = await result.json();

//   res.json(json);
// });

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
