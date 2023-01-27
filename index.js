//import required modules
const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

//Mongo stuff
const dbUrl = "mongodb://127.0.0.1:27017/boardgame";
const client = new MongoClient(dbUrl);

//set up Express app
const app = express();
const port = process.env.PORT || 8888;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var links = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: "Explore",
    path: "/explore"
  },
  {
    name: "About",
    path: "/about"
  }
];
//test Express app
app.get("/", (request, response) => {
  response.render("index", { title: "Home", menu: links });
});
app.get("/explore", async(request, response) => {
  lin = await getLinks();
  response.render("explore", { title: "Explore",a: lin, menu: links  });
})
app.get("/about", (request, response) => {
  response.render("about", { title: "About", menu: links });
})


//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//MONGO FUNCTIONS
async function connection() {
  await client.connect();
  db = client.db("boardgame"); //select testdb database
  return db;
}
/* Async function to retrieve all links documents from menuLinks collection. */
async function getLinks() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("nextturn").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

async function getSingleLink(id) {
  db = await connection();
  const editIdFilter = { _id: new ObjectId(id) };
  const result = db.collection("nextturn").findOne(editIdFilter);
  return result;
}