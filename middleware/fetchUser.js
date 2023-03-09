const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secret");
const fetchUser = (req, res, next) => {
  //Get the user fromm the jwt token and add id to req object
  const token = req.header("tokenId");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid  token" });
  }
};
module.exports = fetchUser;
