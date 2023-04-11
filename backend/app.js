const express = require('express');
const morgan = require("morgan");
const app = express();
const PORT = 3000;

const dotenv = require("dotenv");
dotenv.config({
  silent: true,
});

app.use(morgan("dev", { skip: (req, res) => process.env.NODE_ENV === "test" })); // log all incoming requests
app.use(express.json()); // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })); // decode url-encoded incoming POST data

app.get('/', (req, res)=>{
    res.set('Content-Type', 'text/html');
    res.status(200).send("<h1>Challenge Sample Title</h1>");
});

app.use('/', geoRouter);

module.exports = app;