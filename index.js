if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const { app, express } = require("./server");
const mongoose = require("mongoose");
const cors = require('cors')
const cookieParser = require('cookie-parser')

mongoose.set("strictQuery", true);

const dbUrl = "mongodb://localhost:27017/blogNext"
// const dbUrl = process.env.DB_URL
mongoose
    .connect(dbUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Database conneceted successfully");
    })
    .catch((err) => {
        console.log("Error while connecting to database");
        console.log(err);
    });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
app.use(cookieParser())


const blogRouter = require('./route/blog')
const userRouter = require('./route/auth')

app.use('/blog', blogRouter)
app.use('/auth', userRouter)
