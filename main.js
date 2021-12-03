const express = require('express');
const pool = require('./config/db.config');
const app = express();

app.use(express.json());
app.use(express.urlencoded(
    {extended:true
}));

//connect to database
pool.connect()
.then(()=>{console.log("db connected")});   

//Models


//do not change
const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log("Server listening on port "+ port));