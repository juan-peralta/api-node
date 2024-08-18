import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors"; // Import the cors package

const app = express();
app.use(cors()); // Use the cors middleware

app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./aranceles_referencia_2024.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

// app.get("/", (req, res) => {
//   res.send("Welcome to my first API with Node js!");
// });

app.get("/", (req, res) => {
  const data = readData();
  res.json(data);
});

app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.find((book) => book.id === id);
  res.json(book);
});

app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body;
  const newBook = {
    id: data.length + 1,
    ...body,
  };
  data.push(newBook);
  writeData(data);
  res.json(newBook);
});

app.put("/books/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const bookIndex = data.findIndex((book) => book.id === id);
  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Book updated successfully" });
});

app.delete("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const bookIndex = data.findIndex((book) => book.id === id);
  data.splice(bookIndex, 1);
  writeData(data);
  res.json({ message: "Book deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});