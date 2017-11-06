const express = require('express');
const app = express();
const path = require('path');

const dotenv = require('dotenv').config();

const cors = require('cors');
app.use(cors());

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