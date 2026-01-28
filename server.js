const express = require('express');
require('dotenv').config();
const router = require('./routes/index');
const connectDB = require('./db/apiDB');

const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use('/api', router);

app.listen(port, (err) =>{ 
    if(!err){
        console.log(`Server running on port ${port}`)
    }
});