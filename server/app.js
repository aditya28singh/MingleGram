const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const {MONGOURI} = require("./keys");



mongoose.connect(MONGOURI)

mongoose.connection.on('connected' , ()=>{
    console.log("mongo connected successfully!")
})

mongoose.connection.on('error' , (err)=>{
    console.log("error!", err)
})

require("./models/user")
require("./models/post")

app.use(express.json()) //type of middleware to parse
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
