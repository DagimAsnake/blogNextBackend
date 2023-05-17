const Blog = require("../model/blog")

module.exports.getBlog = async function (req, res) {
    const blogs = await Blog.find({}).sort({ createdAt: -1 })
    let data = [];
    blogs.forEach((blog) => {
        let datas = {
            _id: blog._id,
            title: blog.title,
            topic: blog.topic,
            content: blog.content
        }
        data.push(datas);
    });
    return res.json({
        msg: blogs
    }).status(200)
}

module.exports.addBlog = async function (req, res) {
    const data = req.body;
    if (!(data.title && data.topic && data.content)) {
        return res.json({
            msg: "Inputs are required",
        });
    }

    const inputData = {
        title: data.title,
        topic: data.topic,
        content: data.content
    }

    const newBlog = new Blog(inputData);

    await newBlog.save();
    return res.json({
        msg: "Blog sent successfully"
    }).status(200)
}