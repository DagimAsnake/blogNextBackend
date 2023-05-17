const mongoose = require('mongoose')
const { Schema, model } = mongoose

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const Blog = model("Blog", BlogSchema)
module.exports = Blog 