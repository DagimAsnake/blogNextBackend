const router = require("express").Router();
const blogController = require("../control/blog")
const isLoggedIn = require("../util/isLoggedIn");

router.get('/', blogController.getBlog)
router.post('/add', isLoggedIn, blogController.addBlog)
router.get('/:blogId', blogController.getOneBlog)
router.delete('/delete/:blogId', isLoggedIn, blogController.deleteBlog)
router.put('/update/:blogId', isLoggedIn, blogController.updateBlog)
router.post('/myblogs', isLoggedIn, blogController.getUserBlogs)


module.exports = router;