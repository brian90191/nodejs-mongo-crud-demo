var express = require("express");
var appRoot = require("app-root-path");
var router = express.Router();
const MongoModels = require("mongo-models");

var ToDoList = require(appRoot + "/models/todolist.js");
var conf = require(appRoot + "/config.js")();

var mongo;
(async () => {
	mongo = await MongoModels.connect(conf.mongo, { useUnifiedTopology: true });
	await ToDoList.createIdx(mongo);
})();

router.get("/_disconnect_backend", (req, res) => {
	var source_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

	if (!conf.trusted_source_ip.includes(source_ip)) {
		console.warn("/_disconnect_backend can only be called from trusted source");
		return res.sendStatus(401);
	}

	MongoModels.disconnect();
	res.json({msg: "backend closed"});
});

router.post("/", async (req, res) => {
	let payload = req.body;

	try {
		await ToDoList.add(payload)
			.then((result) => {
				result = result.map((x) => {
					x.create_time = +x.create_time;
					if (x.update_time) { x.update_time = +x.update_time; }
					return x;
				});
				if (result[0] instanceof ToDoList) {
					res.status(201).json({data: result[0]});
				} else {
					res.status(500).json({err: "creation failed", data: result});
				}
			});
	} catch (err) {
		if (err.message.match(/Missing/) || err.message.match(/^ValidationError/)) {
			return res.status(400).json({err: err.message});
		} else {
			res.sendStatus(500);
		}
	}
});

router.get("/", async (req, res) => {
	let since = req.query.since ? new Date(parseInt(req.query.since)) : undefined;	// milliseconds since
	let until = req.query.until ? new Date(parseInt(req.query.until)) : undefined;
	let limit = parseInt(req.query.limit);
	let filter = {};

	if (!req.query.name) {
		return res.status(400).json({err: "Missing 'name'."});
	}

	if (req.query.name) {
		filter.name = req.query.name;
	}

	if (since || until) {
		filter.due_time = {};
		if (since) {filter.due_time.$gte = since;}
		if (until) {filter.due_time.$lt = until;}
	}

	limit = limit || 100;

	try {
		let result = await ToDoList.aggregate([
			{ $match: filter },
			{ $sort: {"due_time": 1} }
		]);

		result = result.map((x) => {
			x.create_time = +x.create_time;
			if (x.update_time) {
				x.update_time = +x.update_time;
			}
			return x;
		});

		return res.json({data: result});

	} catch (e) {
		console.error(e);
		return res.status(500).json({err: "error accrue during data retrieving."});
	}
});

// get by object id
router.get("/:id", async (req, res) => {
	let id = req.params.id;

	try {
		let result = await ToDoList.findById(id);

		if (!result?._id) {
			return res.status(404).json({err: "not found."});
		}
		return res.json({data: result});
	} catch (e) {
		if (e.message.match(/Argument passed in must be a single String of 12 bytes or a string of 24 hex characters/)) {
			return res.status(404).json({err: "not found."});
		} else {
			return res.status(500).json({err: "error accrue during data retrieving."});
		}
	}
});

router.patch("/:id", async (req, res) => {
	let id = req.params.id;
	var id_obj = require("mongodb").ObjectID(id);
	let payload = req.body;

	try {
		let result = await ToDoList.updateOne(
			{_id: id_obj},
			{
				$set: payload,
				$currentDate: { update_time: true }
			}
		);

		if (!result.result.ok) {
			console.warn("Unexpected 404 in searching entity, id: " + id_obj);
			return res.status(404).json({err: "not found."});
		}

		result = await ToDoList.findById(id);

		return res.json({data: result});
	} catch (err) {
		if (err.message.match(/Missing/) || err.message.match(/^ValidationError/)) {
			return res.status(400).json({err: err.message});
		} else {
			res.sendStatus(500).json({err: "error accrue during data retrieving."});
		}
	}
});

router.delete("/:id", async (req, res) => {
	var id_obj = require("mongodb").ObjectID(req.params.id);

	try {
		let result = await ToDoList.deleteOne({_id: id_obj});

		if (!result.result.ok) {
			console.warn("Unexpected 404 in searching entity, id: " + id_obj);
			return res.status(404).json({err: "not found."});
		}

		return res.json({data: {id: req.params.id}});
	} catch (err) {
		console.error(err);
		if (err.message.match(/Missing/) || err.message.match(/^ValidationError/)) {
			return res.status(400).json({err: err.message});
		} else {
			res.sendStatus(500).json({err: "error accrue during data retrieving."});
		}
	}
});

module.exports = router;
