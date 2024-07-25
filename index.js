import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ExpressPeerServer } from 'peer';
import http from 'http'
config();



const app = express();

app.use('/public',express.static('public'));
const PORT = process.env.PORT || 3007;

const server = http.Server(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
})
app.use('/peerjs', peerServer);
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connect to MongoDB success");
    app.use(cors());
    


    app.use(bodyParser.json());
    // Define the schema
const mySchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  total_money: { type: String, required: true },
  bank_number: { type: String, required: true },
  bank_name: { type: String, required: true },
  status: { type: Number, required: true },
});

const MyModel = mongoose.model('MyModel', mySchema);

// Get list
app.get('/items', async (req, res) => {
  try {
    const items = await MyModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create item
app.post('/items', async (req, res) => {
  try {
    console.log(req.body);
    const newItem = new MyModel(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update status
app.put('/items/:id/status', async (req, res) => {
  try {
    const item = await MyModel.findOneAndUpdate(
      { _id: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (error) {
    res.status(500).send(error);
  }
});


    server.listen(PORT, () => {
      console.log('Dinter running on port ' + PORT);
    })
  } catch(err) {
    console.log(err);
  }
}

main();