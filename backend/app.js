const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = 3000;

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
            console.log(data);
            return res.status(200).json({
                locations: [...new Map(data.map((item) => [item["name"], item])).values()]
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