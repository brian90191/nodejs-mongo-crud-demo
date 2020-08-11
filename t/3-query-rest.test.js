"use strict";
var appRoot = require("app-root-path");
var request = require("supertest");
const MongoModels = require("mongo-models");
var app = require(appRoot + "/app.js");

describe("Can do CRUD operations with RESTful API", () => {
	let connection;
	let name = "task1";
	let since = 1597104000;
	let until = 1597276800;
	let obj_id;

	beforeAll(async () => {
		let mongo_setting = {
			uri: global.__MONGO_URI__,
			db: global.__MONGO_DB_NAME__,
		};
		// eslint-disable-next-line no-unused-vars
		connection = await MongoModels.connect(mongo_setting, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	});

	afterAll(() => {
		MongoModels.disconnect();
	});

	it("Create to-do data: POST /todolist/", async (done) => {
		var newThing = {
			name: "task1",
			description: "task desc",
			priority: "top",
			due_time: 1597235700,
			is_done: false
		};
		let res = await request(app)
			.post("/todolist/")
			.send(newThing)
			.expect(201)
			.expect("Content-Type", /json/);

		expect(res.body.data.name).toEqual("task1");
		obj_id = res.body.data._id;

		done();
	});

	it("Get to-do data: GET /todolist/?name={name}", async (done) => {
		let res = await request(app)
			.get("/todolist/?name=" + name)
			.expect(200)
			.expect("Content-Type", /json/);

		expect(res.body.data[res.body.data.length - 1].name).toEqual("task1");
		done();
	});

	it("Should fail if none of since or until are provided as query string", async (done) => {
		let res = await request(app)
			.get("/todolist/")
			.expect(400)
			.expect("Content-Type", /json/);

		expect(res.body.err.match(/^Missing/)).toBeTruthy();
		done();
	});

	it("Should fail if id is invalid", async (done) => {
		let res = await request(app)
			.get("/todolist/33333")
			.expect(404)
			.expect("Content-Type", /json/);

		expect(res.body.err.match(/^not found/)).toBeTruthy();
		done();
	});

	it("Get to-do data with time range (in millisecond): GET /todolist/?name={name}&since={since}&until={until}", async (done) => {
		let res = await request(app)
			.get("/todolist/?name=" + name + "&since=" + since + "&until=" + until)
			.expect(200)
			.expect("Content-Type", /json/);

		expect(res.body.data[res.body.data.length - 1].name).toEqual("task1");
		done();
	});

	it("Get to-do data: GET /todolist/:id", async (done) => {
		let res = await request(app)
			.get("/todolist/" + obj_id)
			.expect(200)
			.expect("Content-Type", /json/);

		expect(res.body.data.name).toEqual("task1");
		done();
	});

	it("Can update to-do data: PATCH /todolist/:id", async (done) => {
		let res = await request(app)
			.patch("/todolist/" + obj_id)
			.send({
				name: "task1",
				description: "update task desc",
				priority: "top",
				due_time: 1597235700,
				is_done: true
			})
			.expect(200)
			.expect("Content-Type", /json/);

		// console.log(res.body);
		expect(res.body.data.name).toEqual("task1");
		expect(res.body.data.description).toEqual("update task desc");
		expect(res.body.data.is_done).toEqual(true);
		done();
	}
	);

	it(
		"Delete to-do Data: DELETE /todolist/:id",
		async (done) => {
			let res = await request(app)
				.delete("/todolist/" + obj_id)
				.expect(200)
				.expect("Content-Type", /json/);

			expect(res.body.data.id).toBe(obj_id);
			done();
		}
	);

	it("Should fail if none of name is provided when adding to-do data", async (done) => {
		let newThing ={
			description: "task desc",
			priority: "top",
			due_time: 1597235700,
			is_done: false
		};
		let res = await request(app)
			.post("/todolist/")
			.send(newThing)
			.expect(400)
			.expect("Content-Type", /json/);

		expect(res.body.err.match(/^Missing/)).toBeTruthy();
		done();
	});

	it("Should be able to disconnect Backend DB after testing", async (done) => {
		let res = await request(app)
			.get("/todolist/_disconnect_backend")
			.expect(200)
			.expect("Content-Type", /json/);
		expect(res.body.msg).toEqual("backend closed");
		done();
	});
});
