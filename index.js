const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

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