const express = require("express");
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongo code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdylf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tourismSite");
        const offerings = database.collection("offerings");
        const orders = database.collection("orders");
        
        // GET API
        app.get('/offers', async (req, res) => {
            const cursor = offerings.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        app.get('/orders', async (req, res) => {
            const cursor = orders.find({});
            const getOrders = await cursor.toArray();
            res.send(getOrders);
        });

        app.get('/offers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const offers = await offerings.findOne(query);

            console.log('Load offer with id: ', id);
            res.send(offers);
        })
        

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const getOrder = await orders.findOne(query);

            console.log('Load offer with id: ', id);
            res.send(getOrder);
        })

        // POST API
        app.post('/offers', async (req, res) => {
            const newOffer = req.body;
            const result = await offerings.insertOne(newOffer);

            console.log('Got new offer', req.body);
            console.log('Added offer', result);
            
            res.json(result);
        });

        app.post('/placeOrder', async (req, res) => {
            const newOrder = req.body;
            const result = await orders.insertOne(newOrder);

            console.log('Got new order', req.body);
            console.log('Added order', result);
            
            res.json(result);
        });

        // UPDATE API
        app.put('/offers/:id', async(req, res) => {
            const id = req.params.id;
            const updatedOffers = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateOffer = {
                $set: {
                    offerName: updatedOffers.offerName,
                    offerDescription: updatedOffers.offerDescription,
                    offerPrice: updatedOffers.offerPrice,
                    offerImage: updatedOffers.offerImage
                },
            };
            const result = await offerings.updateOne(filter, updateOffer, options)
            // console.log('Updating user', req);
            res.json(result);
        })

        app.put('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateOrder = {
                $set: {
                    id: updatedOrder.id,
                    userName: updatedOrder.userName,
                    userEmail: updatedOrder.userEmail,
                    userAddress: updatedOrder.userAddress,
                    userPhone: updatedOrder.userPhone,
                    orderName: updatedOrder.orderName,
                    orderPrice: updatedOrder.orderPrice,
                    orderStatus: updatedOrder.orderStatus
                },
            };
            const result = await orders.updateOne(filter, updateOrder, options)
            // console.log('Updating user', req);
            res.json(result);
        })

        // DELETE API
        app.delete('/offers/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await offerings.deleteOne(query);

            console.log('Deleting offer with id:', result);
            // res.json('Going to delete');
            res.json(result);
        });

        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);

            console.log('Deleting offer with id:', result);
            // res.json('Going to delete');
            res.json(result);
        });
    } 
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => { 
    // Also it can (req, res, next)
    res.send('Tourism site server running.');
}); 

app.listen(port, () => {
    console.log('Listening to port ', port);
})