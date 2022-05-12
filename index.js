const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmuf8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const collection = client.db("warehouse").collection("fruits");

        //Get All

        app.get('/fruits', async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const fruits = await cursor.toArray();
            res.send(fruits)

        })
        //Get One
        app.get('/fruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const fruit = await collection.findOne(query);
            res.send(fruit)
        })
        //create fruit
        app.post('/fruits', async (req, res) => {
            const newFruit = req.body;
            const result = await collection.insertOne(newFruit);
            res.send(result)
        })
        //update fruit
        app.put('/fruits/:id', async (req, res) => {
            const id = req.params.id;
            const updatedFruit = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: { ...updatedFruit }

            }
            console.log(updatedDoc)
            const result = await collection.updateOne(filter, updatedDoc, option);
            res.send(result)
        })
        //Delete
        app.delete('/fruits/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)
// client.connect(err => {
//     const collection = client.db("warehouse").collection("fruits");
//     console.log("mongo is connected")
//     // perform actions on the collection object
//     client.close();
// });




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})