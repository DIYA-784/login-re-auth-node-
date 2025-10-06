const express = require('express');
const app = express();
const cors = require('cors');
const cokieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');

app.use(cors());
app.use(cokieParser());
app.use(helmet());
app.use(express.json());   // as we send the json data as msg so we need to parse it
app.use(express.urlencoded({ extended: true })); // to parse the url encoded data


// db connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    })
// db connection

// routes
app.use('/api/auth', authRouter);
// routes

app.get('/', (req, res) => {
    res.json({ message: 'Hello, World ! '});
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})