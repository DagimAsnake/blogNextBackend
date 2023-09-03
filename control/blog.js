const Blog = require("../model/blog")
const SECRET_KEY = "sjskbjdnbhjnbhjcsnskhnjdb";
const jwt = require("jsonwebtoken");
const User = require('../model/user')

module.exports.getBlog = async function (req, res) {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName');

    const data = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      topic: blog.topic,
      content: blog.content,
      createdAt: blog.createdAt,
      user: {
        username: blog.user.username,
        firstName: blog.user.firstName,
        lastName: blog.user.lastName,
      },
    }));

    return res.status(200).json({
      blogs: data,
    });
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    return res.status(500).json({
      error: 'Server error',
    });
  }
};

module.exports.addBlog = async function (req, res) {
  const token = req.get("Authorization").split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_KEY);

    const data = req.body;
    if (!(data.title && data.topic && data.content)) {
        return res.json({
            msg: "Inputs are required",
        });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(403).json({
          msg: "User not found",
        })
    }

    const inputData = {
        title: data.title,
        topic: data.topic,
        content: data.content,
        user: user._id
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
    const token = req.get("Authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
  
    const { blogId } = req.params;
  
    try {
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ msg: 'Blog not found' });
      }
  
      // Check if the logged-in user is the creator of the blog
      if (blog.user.toString() !== decodedToken.id) {
        return res.status(403).json({ msg: 'Not authorized to delete this blog' });
      }
  
      await Blog.findByIdAndDelete(blogId);
      return res.status(200).json({ msg: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };

  module.exports.updateBlog = async function (req, res) {
    const token = req.get("Authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
  
    const { blogId } = req.params;
    const data = req.body;
    const updatedData = {
      title: data.title,
      topic: data.topic,
      content: data.content,
    };
  
    try {
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ msg: 'Blog not found' });
      }
  
      // Check if the logged-in user is the creator of the blog
      if (blog.user.toString() !== decodedToken.id) {
        return res.status(403).json({ msg: 'Not authorized to update this blog' });
      }
  
      await Blog.findByIdAndUpdate(blogId, updatedData);
      return res.status(200).json({ msg: 'Blog updated successfully' });
    } catch (error) {
      console.error('Error updating blog:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };

  module.exports.getUserBlogs = async function (req, res) {
    const token = req.get("Authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
   
    try {
      const userBlogs = await Blog.find({ user: decodedToken.id })
        .sort({ createdAt: -1 })
        .populate('user', 'username firstName lastName');
  
      const data = userBlogs.map((blog) => ({
        _id: blog._id,
        title: blog.title,
        topic: blog.topic,
        content: blog.content,
        createdAt: blog.createdAt,
        user: {
          username: blog.user.username,
          firstName: blog.user.firstName,
          lastName: blog.user.lastName,
        },
      }));
  
      return res.status(200).json({
        blogs: data,
      });
    } catch (error) {
      console.error('Error retrieving user blogs:', error);
      return res.status(500).json({
        error: 'Server error',
      });
    }
  };