const express = require('express')
const app = express()
const port = process.env.PORT || 5500

app.get('/', (req, res) => res.send('Hello from Aesthetic Ware House!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))