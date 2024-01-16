const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

const cloudinary = require("cloudinary").v2;
cloudinary.config(
    { 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET, 
    }
);

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());

require('./config/database').connect();

app.get('/', (req, res) => {
    res.send('working...')
})

const user = require('./routes/user');
app.use("/api", user);

app.listen(PORT, () => {
    console.log(`server successfully started on ${process.env.API_URL}`);
})