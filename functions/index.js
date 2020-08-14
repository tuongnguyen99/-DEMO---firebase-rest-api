const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bcard-b9b27.firebaseio.com",
});

const express = require("express");
const cors = require("cors");

const app = express();
const db = admin.firestore();

// middleware
app.use(cors({ origin: true }));

//.
app.get("/hello", (req, res) => {
  return res.status(200).send("hello...");
});

//create
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db
        .collection("products")
        .doc("/" + req.body.id + "/")
        .create({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
        });
      return res.status(200).send();
    } catch (error) {
      console.log(err);
      res.status(500).send(error);
    }
  })();
});

//read
app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      let product = await document.get();
      let response = product.data();
      res.status(200).send(response);
    } catch (error) {
      console.log(err);
      res.status(500).send(error);
    }
  })();
});

//read all
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("products");
      let response = [];
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
          const item = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
          };
          response.push(item);
        }
        return response;
      });
      res.status(200).send(response);
    } catch (error) {
      console.log(err);
      res.status(500).send(error);
    }
  })();
});

//update
app.put("/api/update/:id", (req, res) => {
    (async () => {
      try {
        const document =  db.collection('products').doc(req.params.id);
        await document.update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        return res.status(200).send();
      } catch (error) {
        console.log(err);
        res.status(500).send(error);
      }
    })();
  });

//delete
app.delete("/api/delete/:id", (req, res) => {
    (async () => {
      try {
        const document =  db.collection('products').doc(req.params.id);
        await document.delete();
        return res.status(200).send();
      } catch (error) {
        console.log(err);
        res.status(500).send(error);
      }
    })();
  });

exports.app = functions.https.onRequest(app);
