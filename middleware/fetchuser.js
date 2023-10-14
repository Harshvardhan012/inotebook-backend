var jwt = require('jsonwebtoken');
const jwt_secret = "Thisissecret$";

const fetchuser = (req, res, next) => {

    const token = req.header('token');
    if (!token) {
        return res.status(401).send({ error: "Token is Not Vaid" });
    }
    try {
        //  this will fetch id from token
        const data = jwt.verify(token,jwt_secret);
        req.user = data.user;
        next();
    } catch (error) {
        // console.log(req.user.id);
        return res.status(401).send({ error: "Token is not Matched " });
    }
}

module.exports = fetchuser;