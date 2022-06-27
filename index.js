const express = require('express')
const app = express()
const port = process.env.PORT || 5500
const cors = require('cors')
// middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pgt6r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function connect() {
    await client.connect();
    console.log("Connected to MongoDB");

    // collections
    const carouselProductsCollections = client.db("warehouse").collection("products");
    const productsCollections = client.db("shop").collection("products");
    const userCollection = client.db("shop").collection("users");

    // get api
    app.get('/api/carouselProducts', async (req, res) => {
        const products = await carouselProductsCollections.find({}).toArray();
        res.send(products);
    })

    // post api 
    app.post('/api/products', async (req, res) => {
        const product = req.body;
        await productsCollections.insertOne(product);
        res.send(product);
    });

    // get api
    app.get('/api/products', async (req, res) => {
        const products = await productsCollections.find({}).toArray();
        res.send(products);
    });

    // get products by id
    app.get('/api/products/:id', async (req, res) => {
        const id = req.params.id;
        const product = await productsCollections.findOne({ _id: ObjectId(id) });
        res.send(product);
    });

    // product delete api 
    app.delete('/api/products/:id', async (req, res) => {
        const id = req.params.id;
        const result = await productsCollections.deleteOne({ _id: ObjectId(id) });
        res.json(result);
    });

    // product update api
    app.patch('/api/products/:id', async (req, res) => {
        const id = req.params.id;
        const product = req.body;
        const filter = { _id: ObjectId(id) };
        const option = { upsert: true };
        const updateDoc = { $set: product };
        const result = await productsCollections.updateOne(filter, updateDoc, option);
        res.json(result);
    });


    // user collection post api 
    app.post('/api/users', async (req, res) => {
        const user = req.body;
        console.log(user);
        await userCollection.insertOne(user);
        res.send(user);
    });


    // user collection get api
    app.get('/api/users', async (req, res) => {
        const users = await userCollection.find({}).toArray();
        res.send(users);
    });

}
connect().catch(console.dir);

app.get('/', (req, res) => res.send('Hello from Aesthetic Ware House!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))