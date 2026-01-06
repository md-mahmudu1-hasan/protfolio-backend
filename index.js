const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const uri =process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("profolio_data");
    const projects = database.collection("projects");


    // routes
    app.get("/", (req, res) => {
      res.send("Hello, World!");
    });

    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projects.insertOne(project);
      res.send(result);
    });

    app.get("/projects", async (req, res) => {
      const cursor = projects.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const project = await projects.findOne(query);
      res.send(project);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
