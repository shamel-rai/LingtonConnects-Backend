const express = require('express');

const { getPostBySearch, getPosts, getASingplePost, createPost, updatePost, deletePost, likedPost, commentPost } = require('../controller/PostController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/imageMiddleware');

const router = express.Router();


router.route('/post').post(auth, upload.array('files'), createPost);
router.route('/:id?').patch(auth, updatePost);
router.route('/:id?').delete(auth, deletePost);
router.route('/like/:id').patch(auth, likedPost);
router.route('/comment/:id').post(auth, commentPost);
router.route('/post').get(auth, getPosts)
router.route('/singlepost').get(auth, getASingplePost);
router.route('/searchPost').get(auth, getPostBySearch);


module.exports = router; 