const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

const app = express();

app.use(express.json());

const db = config.get('mongoURI');

mongoose.connect(db, { useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})  
        .then(()=>console.log("MongoDB connected"))
        .catch(err=>console.log(err));

app.use('/api/users', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server is running at ${port}`);
});