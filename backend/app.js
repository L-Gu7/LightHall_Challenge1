const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const dotenv = require("dotenv");
dotenv.config({
  silent: true,
});

app.use(morgan("dev", { skip: (req, res) => process.env.NODE_ENV === "test" })); // log all incoming requests
app.use(express.json()); // decode JSON-formatted incoming POST data
app.use(cors({ origin: process.env.FRONT_END_DOMAIN, credentials: true })); // allow incoming requests only from a "trusted" host
app.use(express.urlencoded({ extended: true })); // decode url-encoded incoming POST data

const mongoose = require("mongoose");
const db = require("./models/db.js");
const Click = mongoose.model("Click");

app.get('/', async (req, res) => {
    try {
        Click.find({}).then(data => {
            const pairs = new Set();
            for (const location of data) {
                const { latitude, longitude } = location;
                const pair = `${latitude},${longitude}`; // Create a string representation of the pair
                pairs.add(pair); // Add the pair to the Set
            }
            unique_loc =  Array.from(pairs).map(s=>s.split(',')).map(p => ({"latitude":parseFloat(p[0]),"longitude":parseFloat(p[1])}));
            return res.status(200).json({
                locations: unique_loc
            });
          }).catch((err) => {
            console.log(err);
          });
    }catch(err){
        console.error(err);
        res.status(400).json({
            error: err,
        });
    }
});

app.post('/', async (req, res) => {
    try {
        await Click.create(
            {
                latitude: req.body.location.latitude,
                longitude: req.body.location.longitude
            }
        );
        return res.status(200);
    }catch(err){
        console.error(err);
        res.status(400).json({
            error: err,
        });
    }
})

module.exports = app;