import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  database:'permalist',
  host:'localhost',
  port: 5432,
  password : "password"
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

db.connect();

app.get("/", async (req, res) => {
  items = (await (db.query("SELECT * FROM items"))).rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query('INSERT INTO items (title) VALUES($1)',[item])
  res.redirect("/");
});

app.post("/edit",async (req, res) => {
  const updatedItem = req.body.updatedItemTitle;
  const updatedId =  req.body.updatedItemId;
  await db.query("UPDATE items SET title = $1 WHERE id = $2",[updatedItem,updatedId])
  res.redirect('/');
});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;
  await db.query('DELETE FROM items WHERE id = $1',[id]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
