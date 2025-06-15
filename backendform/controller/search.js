const User = require("../model/usersigma");
const jwt = require('jsonwebtoken');

const search = async (req, res) => {
    try {
        console.log(req.body);
        const { username } = req.body;
        const searchdata = await User.find({ username: username });
        res.json({ searchdata });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Error searching for user" });
    }
};

const savefollower = async (req, res) => {
    try {
        const { id } = req.body; 
        console.log(req.body)
        console.log("user foollowing")// id of the user to follow
        const token = req.cookies.sociluser;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const jwtsecret = 'ashishgupta2531';
        // Assuming the JWT payload contains the user's ID as `id`
        const decodedToken = jwt.verify(token, jwtsecret);
        const currentUserId = decodedToken.id; // id of the current user

        // Add the user being followed to the current user's 'following' list
        await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: id } });

        // Add the current user to the 'followers' list of the user being followed
        await User.findByIdAndUpdate(id, { $addToSet: { followers: currentUserId } });

        res.json({ message: "User successfully followed" });
    } catch (error) {
        console.error("Follow error:", error);
        res.status(500).json({ error: 'An error occurred while following the user.' });
    }
};

module.exports = { search, savefollower };