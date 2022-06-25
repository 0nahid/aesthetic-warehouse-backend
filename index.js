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

}
connect().catch(console.dir);

app.get('/', (req, res) => res.send('Hello from Aesthetic Ware House!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))