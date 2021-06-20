const { Router } = require("express");
const { getClient } = require("../mongoConfig");

const client = getClient();

const router = Router();

router.get("/", async (req, res, next) => {
   try {
      let User = await client.db("Waitlist").collection("Users");
      let users = await User.find({}).toArray();

      return res.json({ status: "ok", data: users });
   } catch (error) {
      return next(error);
   }
});

router.get("/:Username", async (req, res, next) => {
   let { Username } = req.params;
   try {
      let User = await client.db("Waitlist").collection("Users");

      let _user = await User.findOne({ Username });

      return res.json({ status: "ok", data: _user });
   } catch (error) {
      return next(error);
   }
});

module.exports = router;
