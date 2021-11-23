const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const User = require("../../models/users");

router.post("/user/signup", [], async (req, res, next) => {
  let user = await User.getUserActiveByEmail(req.body.email);
  try {
    if (user) {
      res.status(409);
      throw new Error("User with this email exist");
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      try {
        if (err) {
          res.status(500);
          throw err;
        }
        const user = await User.newGenericUser({
          userId: nanoid(),
          email: req.body.email,
          password: hash,
        });
        if (user instanceof Error) {
          res.status(500);
          throw user;
        }
        res.status(200).json(user).send();
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/user/login", async (req, res, next) => {
  const user = await User.getUserActiveByEmail(req.body.email);
  if (user == null) {
    res.status(500);
    next(new Error("Auth failed"));
  }

  bcrypt.compare(req.body.password, user.password, async (err, result) => {
    try {
      if (err || result == false) {
        res.status(500);
        throw new Error("Auth failed");
      }
      const token = jwt.sign(
        {
          email: user.email,
          userId: user.userId,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res
        .status(200)
        .json({
          message: "Auth successful",
          token: token,
        })
        .send();
    } catch (error) {
      next(error);
    }
  });
});

// @Add authentication middleware
router.delete("/user/:userId", [], async (req, res, next) => {
  try {
    let user = await User.getUserActiveByUserId(req.params.userId);

    const result = await user.deleteUserWithLog();
    if (result instanceof Error) {
      res.status(500);
      throw result;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
module.exports = router;
