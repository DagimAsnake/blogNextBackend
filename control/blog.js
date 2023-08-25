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

module.exports.getOneBlog = async function (req, res) {
    const { blogId } = req.params;
    const one_blog = await Blog.findById(blogId);
    if (!one_blog) {
      return res
        .json({
          msg: "Id dont exist",
        })
        .status(403);
    }
    return res
      .json({
        msg: one_blog,  
      })
      .status(200);
  };

  module.exports.deleteBlog = async function(req, res) {
    const { blogId } = req.params;
    const data_exists = await Blog.findByIdAndDelete(blogId);
    if (!data_exists) {
      return res
        .json({
          msg: "No Such Blog",
        })
        .status(403);
    }
  
    return res
      .json({
        msg: "Blog Deleted Successfully",
      })
      .status(200);
  }

  module.exports.updateBlog = async function (req, res) {
    const { blogId } = req.params; 
    const data = req.body;
    const updated_data = {
        title: data.title,
        topic: data.topic,
        content: data.content
    };
    const data_exists = await Blog.findOneAndUpdate({ _id: blogId }, updated_data, {
      runValidators: true,
    });

    if (!data_exists) {
        return res.status(403).json({msg: 'No data exists'}); 
      }
      
      res.status(200).json({msg: 'Updated successfully'});
  }