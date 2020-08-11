var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
	let lala = req?.query?.msg;
	res.json({ title: "Express " + lala});
});

module.exports = router;
