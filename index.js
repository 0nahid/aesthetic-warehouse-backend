const express = require('express')
const app = express()
const port = process.env.PORT || 5500
const cors = require('cors')
// middleware
app.use(cors())
app.use(express.json())

//jwt 
const jwt = require('jsonwebtoken');
const accessToken = process.env.JSW_ACCESS_TOKEN;

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: "Forbidden access" });
        }
        req.decoded = decoded;
        next();
    });
}

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
    const orderCollection = client.db("shop").collection("orders");

    app.put("/user", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = {
            $set: user,
        };
        const result = await userCollection.updateOne(
            filter,
            updateDoc,
            options
        );
        const token = jwt.sign(
            { email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
        res.send({ result, token });
    });



    // get api
    app.get('/api/carouselProducts', async (req, res) => {
        const products = await carouselProductsCollections.find({}).toArray();
        res.send(products);
    })

    // post api 
    app.post('/api/products', verifyJWT, async (req, res) => {
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
    app.delete('/api/products/:id', verifyJWT, async (req, res) => {
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

    // order post api
    app.post('/api/product/order', async (req, res) => {
        const order = req.body;
        console.log(order);
        await orderCollection.insertOne(order);
        res.send(order);
    });

    // order get api
    app.get('/api/orders', async (req, res) => {
        const email = req.query.email;
        const orders = await orderCollection.find({ email: email }).toArray();
        res.send(orders);
    })


}
connect().catch(console.dir);

app.get('/', (req, res) => res.send('Hello from Aesthetic Ware House!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))