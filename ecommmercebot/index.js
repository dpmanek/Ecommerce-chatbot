const express = require('express');
const app = express();
const dialogflow = require("./router/dialogflow");
const azure = require("./router/azure");
const cors = require('cors')
const bodyParser = require("body-parser");
var path=require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("",dialogflow);
app.use("",azure);



app.listen(3000,() => console.log("running on 3000"));




