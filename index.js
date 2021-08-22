const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const app = express();
const validateToken = require('./middlewares/validateToken');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded());

mongoose.connect(process.env.ATLAS_URI,{useNewUrlParser:true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connection stablished sucessfully!'));

app.get('/', validateToken ,function(req,res){
    res.json({
        message: 'Hello World!!!'
    });
});

app.use('/auth', auth);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});