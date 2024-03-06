const userPostsService = require('../services/userPosts');
const tokenService = require('../services/token');


const createPost = async (req, res) => {
    try {
        const { text, picture } = req.body;
        const username = req.params.id

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        console.log("logged on username:", loggedUsername);
        console.log("actual username:", username);

        // Check if the user is authorized to perform the update
        if (username !== loggedUsername) {
            return res.status(403).json({ errors: ['User is not authorized to crete post here'] });
        }

        const newPost = await userPostsService.createPost(username, text, picture);
        res.status(201).json(newPost); // Respond with the created post
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getUserPosts = async (req, res) => {
    try {
        const username = req.params.id
        
        const token = req.headers.authorization.split(' ')[1];
         // Verify the token using the token service
         const loggedUsername = await tokenService.verifyToken(token);

         console.log("logged on useranme: ", loggedUsername);
         console.log("actual useranme: ", username);


         const posts = await userPostsService.getUserPosts(loggedUsername, username);

         if (posts && posts.error) {
            // If an error occurred in the service, return the error response
            return res.status(403).json({ error: posts.error });
        }

        res.json(posts);
        
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updatePost = async (req, res) => {
    const username = req.params.id;
    const postId = req.params.pid;
    const updatedField = req.body;

    // Extract the token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using the token service
    const loggedUsername = await tokenService.verifyToken(token);

    console.log("logged on username:", loggedUsername);
    console.log("actual username:", username);

    // Check if the user is authorized to perform the update
    if (username !== loggedUsername) {
        return res.status(403).json({ errors: ['User is not authorized to update this post'] });
    }

    // Check if any fields are provided for update
    if (Object.keys(updatedField).length === 0) {
        return res.status(400).json({ errors: ['No fields provided for update'] });
    }

    try {
        const updatedPost = await userPostsService.updatePost(postId, updatedField);

        if (!updatedPost) {
            return res.status(404).json({ errors: ['Post not found'] });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ errors: ['Failed to update post'] });
    }
}


const deletePost = async (req, res) => {
    try {
        const username = req.params.id
        const postId = req.params.pid

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        console.log("logged on username:", loggedUsername);
        console.log("actual username:", username);

        // Check if the user is authorized to perform the update
        if (username !== loggedUsername) {
            return res.status(403).json({ errors: ['User is not authorized to update this post'] });
        }
        res.json(await userPostsService.deletePost(username, postId));

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { getUserPosts, createPost, deletePost, updatePost }