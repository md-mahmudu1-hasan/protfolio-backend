const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
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
      const featuredId = "69ec8a45cf9773abc9d19ebb";

      const featuredProject = await projects.findOne({
        _id: new ObjectId(featuredId),
      });

      const otherProjects = await projects
        .find({ _id: { $ne: new ObjectId(featuredId) } })
        .toArray();

      const result = featuredProject
        ? [featuredProject, ...otherProjects]
        : otherProjects;

      res.send(result);
    });

    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const project = await projects.findOne(query);
      res.send(project);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

// server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
