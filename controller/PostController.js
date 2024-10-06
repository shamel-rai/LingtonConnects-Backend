const { default: mongoose } = require('mongoose');
const Post = require('../model/PostModel');

exports.getPostBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const searchPost = await Post.find({
            $or: [{ title },
            { tags: { $in: tags.split(',') } }
            ]
        });

        res.status(200).json({
            status: 'Success',
            post: searchPost
        })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.getPosts = async (req, res) => {
    try {
        const findPosts = await Post.find();
        res.status(200).json({
            status: 'Success',
            post: findPosts
        })
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: `Failed: ${error.message}`
        })
    }
}
exports.getASingplePost = async (req, res) => {
    const { id } = req.params.id;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                status: 'Failed',
                message: "Could not find the post"
            })
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.createPost = async (req, res) => {
    const { title, message, tags } = req.body; // Get data from request body
    const fileSelected = req.files ? req.files.map(file => file.path) : []; // Get uploaded file paths

    try {
        const newPost = new Post({
            title,
            message,
            creator: req.user.id,
            tags: tags ? tags : (tags ? tags.split(',') : []), // Check if tags is an array
            fileSelected
        });

        await newPost.save(); // Save the new post
        res.status(201).json({
            status: 'Success',
            post: newPost
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};




exports.updatePost = async (req, res) => {
    try {
        // console.log(req.user)

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) { //checkts for valid post ID
            return res.status(404).json({ message: "No post with such id " })
        }

        const exisitingPost = await Post.findById(req.params.id);
        if (!exisitingPost) {
            return res.status(404).json({
                message: 'Post not found'
            })
        }

        if (exisitingPost.creator.toString() !== req.user.id) { //checks if the user is the owner of the post
            return res.status(403).json({ message: 'You are not authorized to update this post' })
        }

        const postUpdate = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });


        res.status(200).json({
            status: 'Success',
            post: postUpdate
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'An error occurred while updating the post',
            error: error.message
        })
    }

}

exports.deletePost = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "No post with such id " })
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: 'No post found'
            })
        }
        if (post.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this post' })
        }
        const deletePost = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'Success',
            post: deletePost
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'An error occurred while updating the post',
            error: error.message
        })
    }
}

exports.likedPost = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                status: 'failed',
                message: 'No Such post Found'
            })
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Post not Found'
            })
        }
        const userId = Sting(req.user.id);
        const userHasLikedPost = post.likes.includes(userId);

        if (userHasLikedPost) { // this will toggle like/unlike
            post.likes = post.likes.filter((id) => id !== userId);
        }
        else {
            post.likes.push(userId)
        }
        const updatedLikePost = await Post.findByIdAndUpdate(req.params.id, post, { new: true, runValidators: true });
        res.status(200).json({
            status: 'Success',
            post: updatedLikePost
        })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}

exports.commentPost = async (req, res) => {
    try {
        const comments = req.body;
        if (!comments || !comments.text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const postComment = await Post.findById(req.params.id);
        if (!postComment) {
            return res.status(404).json({
                message: 'Post was not found'
            })
        }
        postComment.comments.push(comments);

        const updatedpostComment = await Post.findByIdAndUpdate(req.params.id, { comments: postComment }, { new: true, runValidators: true });
        res.status(200).json({
            status: 'Success',
            post: updatedpostComment
        })
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}