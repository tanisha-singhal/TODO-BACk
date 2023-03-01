const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const {JWT_SECRET}=require("../secret");
const {CLIENT_ID}=require("../secret");
const client = new OAuth2Client(
  CLIENT_ID
);

router.post("/googleLogin", (req, res) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
      CLIENT_ID,
    })
    .then((response) => {
      console.log(response);
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec(async (err, user) => {
          if (err) {
            return res.status(400).json({
              error: "Something went wrong...",
            });
          } else {
            if (user) {
              const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
                expiresIn: "7d",
              });
              const { _id, name, email } = user;
              res.json({
                token,
                user: { _id, name, email },
              });
            } else {
              const salt = await bcrypt.genSalt(10);
              const password = await bcrypt.hash(email + JWT_SECRET, salt);
              let newUser = new User({ name, email, password });
              newUser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: "Something went wrong...",
                  });
                }
                const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
                  expiresIn: "7d",
                });
                const { _id, name, email } = data;
                res.json({
                  token,
                  user: { _id, name, email },
                });
              });
            }
          }
        });
      }
    });
});

module.exports = router;
