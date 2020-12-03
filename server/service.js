const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

let objectsJSON = require("./obstacles.json");
//let audioJSON = require("./audioData.json");

app.use(cors());

app.get("/", (req, res) => {
  let objectsString = JSON.stringify(objectsJSON);
  //let audioString = JSON.stringify(audioJSON);

  let finalString = objectsString; //+ " * " + audioString;
  res.send(finalString);
});

app.get("/index.html", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.js", (req, res) => {
  res.sendFile(__dirname + "/index.js");
});

app.get("/image/base.png", (req, res) => {
  res.sendFile(__dirname + "/image/base.png");
});

app.get("/image/right.png", (req, res) => {
  res.sendFile(__dirname + "/image/right.png");
});

app.get("/image/left.png", (req, res) => {
  res.sendFile(__dirname + "/image/left.png");
});

app.get("/image/pipe.png", (req, res) => {
  res.sendFile(__dirname + "/image/pipe.png");
});

app.get("/image/smallcloud.png", (req, res) => {
  res.sendFile(__dirname + "/image/smallcloud.png");
});

app.get("/image/largecloud.png", (req, res) => {
  res.sendFile(__dirname + "/image/largecloud.png");
});

app.get("/image/background.png", (req, res) => {
  res.sendFile(__dirname + "/image/background.png");
});

app.get("/image/mountain.png", (req, res) => {
  res.sendFile(__dirname + "/image/mountain.png");
});

app.get("/image/bigblock.png", (req, res) => {
  res.sendFile(__dirname + "/image/bigblock.png");
});

app.get("/image/block.png", (req, res) => {
  res.sendFile(__dirname + "/image/block.png");
});

app.get("/image/monster.png", (req, res) => {
  res.sendFile(__dirname + "/image/monster.png");
});

app.get("/image/dead.png", (req, res) => {
  res.sendFile(__dirname + "/image/dead.png");
});

app.get("/image/mushroom.png", (req, res) => {
  res.sendFile(__dirname + "/image/mushroom.png");
});

app.get("/image/coin.png", (req, res) => {
  res.sendFile(__dirname + "/image/coin.png");
});

app.get("/image/emptyblock.png", (req, res) => {
  res.sendFile(__dirname + "/image/emptyblock.png");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
