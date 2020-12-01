const express = require("express");

//?
require("dotenv").config();

const app = express();
const port = 3001;

//?
app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
