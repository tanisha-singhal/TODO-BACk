const express = require("express");
const mongoose = require("mongoose");
const {URL}=require("./secret");
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(URL)
  .then(function (db) {
    console.log("db connected");
  })
  .catch(function (err) {
    console.log("err", err);
  });

app.use("/api/todo", require("./routes/todo"));
app.use("/api/users", require("./routes/user"));

app.listen(process.env.PORT||5000, () => {
  console.log(` app listening at http://localhost:5000`);
});
