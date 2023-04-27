const express = require("express");
const app = express();
const PORT = process.env.PORT || 3333;
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (err, file) => {
    err ? console.log("Error", err) : res.send(JSON.parse(file));
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    title,
    text,
    id: uuid.v4(),
  };
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (err, file) => {
    err ? console.log("Error", err) : console.log("New Note Added!");
    const files = JSON.parse(file);
    files.push(newNote);
    const data = JSON.stringify(files);
    fs.writeFile(path.join(__dirname, "./db/db.json"), data, (err) => {
      err ? console.log("") : res.status(200).send(data);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", (err, file) => {
    err ? console.log("Error", err) : console.log("Type: ", typeof file);
    const files = JSON.parse(file);
    console.log("Index of: ", files.indexOf(`${req.params.id}`));
    const filteredFiles = files.filter((items) => items.id !== req.params.id);
    console.log("Filtered Files:\n", filteredFiles);
    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(filteredFiles),
      (err) => {
        err ? console.log(err) : res.status(200).send(filteredFiles);
      }
    );
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(PORT);
});
