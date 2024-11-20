import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ExpressPeerServer } from 'peer';
import http from 'http'
import PayOS from "@payos/node";
import QRCode from 'qrcode-svg';
config();



const app = express();

app.use('/public',express.static('public'));
const PORT = process.env.PORT || 3007;

const payos = new PayOS("4898d756-c74c-474a-a130-7a77ab262bf4", "be42b54b-b79f-491f-8071-85e1ab7978c7", "4d282c87b7b6a0bbb23d8c67f1e5fb34d3c83ca9c505ecbab307fbe7421ad0b8");
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
const api_key = 'AK_CS.7fd8c230774711ef80bb3d5e2ce05983.KQI6QB6yum2sKgScFcbJEmgmUXKFQxPG98JzsWybvmY2I2cjwlHl1uYKbn2wIJp7revP4agF';

function generateQRCodeSVG(text) {
  const qrCode = new QRCode({
    content: text,
    padding: 4,
    width: 256,
    height: 256,
    color: "#000000",
    background: "#ffffff",
    ecl: "M", // Error correction level
  });
  return qrCode.svg();
}
function convertTextToUrl(text) {
  const encodedText = encodeURIComponent(text);
  return `https://quickchart.io/qr?text=${encodedText}&size=200`;
}
app.post('/create-payment', async(req,res) => {
const paymentLinkData = await payos.createPaymentLink(req.body);
const qrImg = generateQRCodeSVG(paymentLinkData.qrCode);

res.send({
  data: paymentLinkData,
  imgQr: convertTextToUrl(paymentLinkData.qrCode)
})
})
app.get('/get-status-order/:id', async(req, res) => {
  const response = await payos.getPaymentLinkInformation(req.params.id);
  res.send(response)
})

    server.listen(PORT, () => {
      console.log('Dinter running on port ' + PORT);
    })
  } catch(err) {
    console.log(err);
  }
}

main();
