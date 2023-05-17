const { app, express } = require("./server");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const dbUrl = "mongodb://localhost:27017/blogNext"

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


const blogRouter = require('./route/blog')

app.use('/blog', blogRouter)
