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
}
connect().catch(console.dir);

app.get('/', (req, res) => res.send('Hello from Aesthetic Ware House!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))