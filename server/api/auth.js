const { Router } = require("express");
const { getClient } = require("../mongoConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateReferralToken = require("../utils/generateReferralToken");

const router = Router();

const client = getClient();

function loginUser(Username, Email, res) {
   let token = jwt.sign({ Username, Email }, process.env.JWT_SECRET);
   return res
      .cookie("token", token, {
         httpOnly: true,
      })
      .json({ status: "ok", data: "" });
}

router.post("/register", async (req, res, next) => {
   let { Username, Email, Password, ReferralToken } = req.body;
   try {
      let User = await client.db("Waitlist").collection("Users");

      if (!Username || !Email || !Password)
         throw new Error("Insufficient credentials");

      let nameInDb = await User.findOne({ Username });
      let emailInDb = await User.findOne({ Email });

      if (nameInDb || emailInDb)
         throw new Error("Username or Email already in use");

      let hashedPassword = await bcrypt.hash(Password, 10);

      if (ReferralToken) {
         await User.updateOne({ ReferralToken }, { $inc: { WaitingList: -1 } });
      }

      let userReferralToken = generateReferralToken();

      await User.insertOne({
         Username,
         Email,
         Password: hashedPassword,
         ReferralToken: userReferralToken,
         WaitingList: 99,
      });

      return loginUser(Username, Email, res);
   } catch (error) {
      return next(error);
   }
});

router.post("/login", async (req, res, next) => {
   let { Username, Email, Password } = req.body;

   try {
      let User = await client.db("Waitlist").collection("Users");

      let _user = await User.findOne({ Username, Email });

      if (!_user) throw new Error("Invalid credentials");

      let verifyPassword = await bcrypt.compare(Password, _user.Password);

      if (!verifyPassword) throw new Error("Wrong password");

      return loginUser(Username, Email, res);
   } catch (error) {
      return next(error);
   }
});

module.exports = router;
