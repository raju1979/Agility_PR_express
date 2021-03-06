const express = require('express');
const app = express();
const path = require('path');

const dotenv = require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser({limit: '5mb'}));

app.use(express.static(path.join(__dirname,"./public")));

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_CONF, {
    useMongoClient: true
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error in connection"))
db.once("open", () => {
    console.log('connected');
    app.listen(app.get('port'), function() {
        console.log('App running on ' + app.get('port'));
    })
})

// Import router
const userRoute = require("./routes/userRoutes");
app.use("/api/ContactManager",userRoute);


app.set('port', (process.env.PORT_NO || 5000));

app.get("/", (req, res) => {
    res.send("welcome")
})