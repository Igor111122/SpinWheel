const express = require('express');
const bodyParser = require('body-parser');
const { sendMail } = require('./mail');
const cors = require('cors');// need to cors policy
require('dotenv').config();

const app = express();
const port = process.env.PORT;

let arrOfCoupons = [
  [419412, 124315, 124335, 340598, 223498, 934514, 664412, 845821],
  [456324, 340589, 894312, 693453, 998242, 984351, 576943, 483103]
];

app.use(bodyParser.json());
app.use(cors());

app.get('/getCoupon', (req, res) => {
  try {
    const numOfShop = req.query.numOfShop;
    const numOfSectors = req.query.numOfSectors;

    if (numOfShop === undefined || numOfSectors === undefined || req.query.mailTarget === undefined) {
      throw new Error('Необходимо предоставить numOfShop и numOfSectors и mailTarget');
    }

    const angle = 360 / numOfSectors;
    const randomPrice = Math.floor(Math.random() * numOfSectors) + 1;
    const sendDegree = ((randomPrice-1) * angle) + 1080;

    sendMail(arrOfCoupons[numOfShop][randomPrice-1], req.query.mailTarget);

    res.json({
        rotateDegree: sendDegree,//degree of rotation
        price: randomPrice,//actual num of field
        coupon: arrOfCoupons[numOfShop][randomPrice]//coupon for user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/updateCoupons', (req, res) => {
  try {
    const numOfShop = req.body.numOfShop;
    const updatedCoupons = req.body.updatedCoupons;

    if (numOfShop === undefined || updatedCoupons === undefined) {
      throw new Error('Необходимо предоставить numOfShop и updatedCoupons');
    }

    arrOfCoupons[numOfShop] = updatedCoupons;

    res.send('Купоны успешно обновлены');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/createCoupons', (req, res) => {
  try {
    const newCoupons = req.body.newCoupons;

    if (newCoupons === undefined) {
      throw new Error('Необходимо предоставить newCoupons');
    }

    arrOfCoupons.push(newCoupons);

    res.send('Новые купоны успешно созданы');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
