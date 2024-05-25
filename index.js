require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
const carBrandNames = require('./carBrandNames.json')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rkfual6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("carsDB");
    const carCollection = database.collection("carCollection");

    app.post('/cardetails', async (req, res) => {
      const details = req.body;
      const result = await carCollection.insertOne(details);
      res.send(result)
    })

    app.get('/cardetails', async (req, res) => {
      const carList = carCollection.find();
      const result = await carList.toArray();
      res.send(result)
    })

    app.get('/cardetails/:brand_name', async (req, res) => {
      const brandname = req.params.brand_name;
      const query = { brandName: brandname };
      const carList = carCollection.find(query);
      const result = await carList.toArray();
      res.send(result)
    })

    app.get('/details/:id', async (req, res) => {
      const carId = req.params.id;
      const query = { _id: new ObjectId(carId) };
      const result = await carCollection.findOne(query);
      res.send(result)
    })

    app.put('/details/:id', async (req, res) => {
      console.log(req.body);
      console.log(req.params.id);

      const filter = { _id: new ObjectId(req.params.id) };
      const updateDoc = {
        $set: {
          carModel: req.body.carModel,
          photo: req.body.photo,
          price: req.body.price,
          rating: req.body.rating,
          shortDescription: req.body.shortDescription
        },
      };
      const result = await carCollection.updateOne(filter, updateDoc);
      res.send(result)
    })


    //Cart Database:-----------------------------------
    const cartCollection = database.collection("cartCollection");

    app.post('/cart', async (req, res) => {
      const details = req.body;
      const result = await cartCollection.insertOne(details);
      res.send(result)
    })

    app.get('/cart', async (req, res) => {
      const cartList = cartCollection.find();
      const result = await cartList.toArray();
      res.send(result);
    })
    app.delete('/cart/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World! Hello from the other side!!')
})

app.get('/carBrandNames', (req, res) => {
  res.send(carBrandNames);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})