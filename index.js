const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  
const uri = "mongodb+srv://sensorcol:fRspAH6lC5nMdtpO@cluster0.rj030.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
      const db = client.db("sensorcol");
      const toolsCollection = db.collection("toolsCollection");
      const ordersCollection = db.collection("ordersCollection");
      const usersCollection = db.collection("usersCollection");
      const reviewsCollection = db.collection("reviewsCollection");
      const blogsCollection = db.collection("blogsCollection");
      const adminsCollection = db.collection("adminsCollection");
      app.put("/user/:email", async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        console.log("user", user);
        const query = {
          email: email
        };
        const options = {
          upsert: true,
        };
        const updatedDoc = {
          $set: {
            email: user?.email,
            role: user?.role,
          },
        };
        const result = await usersCollection.updateOne(
          query,
          updatedDoc,
          options
        );
        res.send(result);
      });
      //API to update a user
      app.put("/update/user/:email", async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        console.log("user", user);
        const query = {
          email: email
        };
        const options = {
          upsert: true,
        };
        const updatedDoc = {
          $set: {
            displayName: user?.displayName,
            institution : user?.institution,
            phoneNumber : user?.phoneNumber,
            address : user?.address,
            dateOfBirth : user?.dateOfBirth
          },
        };
        const result = await usersCollection.updateOne(
          query,
          updatedDoc,
          options
        );
        res.send(result);
      });
  
      //API to make Admin
      app.put("/user/admin/:email", verifyJWT, verifyAdmin, async (req, res) => {
        const email = req.params.email;
        const filter = { email: email };
        const options = { upsert: true }
        const updateDoc = {
          $set: { 
            email: email,
            role: "admin" },
        };
        const result = await adminsCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      });