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
const finduser = async(req,res)=>{
    const token = req.cookies.sociluser;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const jwtsecret = 'ashishgupta2531';
    const decodedToken = jwt.verify(token, jwtsecret);
    const currentUserId = decodedToken.id; 
    const userlist = await User.findById(currentUserId);
     const userlist1 = userlist.following;
     const userlist2 = await User.find({ _id: { $in: userlist1 } });
     res.json({ userlist2 });
}
const savefollower = async (req, res) => {
    try {
    const { id } = req.body; 
        console.log(req.body)
        console.log("user foollowing")
        const token = req.cookies.sociluser;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const jwtsecret = 'ashishgupta2531';
        const decodedToken = jwt.verify(token, jwtsecret);
        const currentUserId = decodedToken.id; 

        await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: id } });
        await User.findByIdAndUpdate(id, { $addToSet: { followers: currentUserId } });

        res.json({ message: "User successfully followed" });
    } catch (error) {
        console.error("Follow error:", error);
        res.status(500).json({ error: 'An error occurred while following the user.' });
    }
};

module.exports = { search, savefollower,finduser };