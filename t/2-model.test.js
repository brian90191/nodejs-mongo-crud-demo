"use strict";
var appRoot = require("app-root-path");

const MongoModels = require("mongo-models");
const ToDoList = require(appRoot + "/models/todolist.js");

const mockData = {
	name: "task1",
	description: "task desc",
	priority: "top",
	due_time: 1597235700,
	is_done: false
};

describe("Can do CRUD operations to Model", () => {
	let connection;
	let id;

	beforeAll(async () => {
		let mongo_setting = {
			uri: global.__MONGO_URI__,
			db: global.__MONGO_DB_NAME__,
		};
		connection = await MongoModels.connect(mongo_setting, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	});

	afterAll(() => {
		MongoModels.disconnect();
	});


	it("should create indexes in ToDoList", async () => {
		let res = await ToDoList.createIdx(connection);
		expect(res.ok).toEqual(1);
		expect(res.numIndexesAfter >= res.numIndexesBefore).toBeTruthy();
	});

	it("should insert a doc into collection", async () => {
		let res = await ToDoList.add(mockData);
		expect(res[0] instanceof ToDoList).toBeTruthy();
	});

	it("should find the inserted doc in collection", async () => {
		const insertedUser = await ToDoList.findOne({name: "task1"});
		expect(insertedUser.name).toEqual(mockData.name);
		id = insertedUser._id;
	});

	it("should able to patch the inserted doc in collection", async () => {
		const updateMockData = {
			name: "task1",
			description: "update task desc",
			priority: "top",
			due_time: 1597235700,
			is_done: true
		};

		let result = await ToDoList.updateOne(
			{_id: id},
			{
				$set: updateMockData,
				$currentDate: { update_time: true }
			}
		);
		expect(result.result.n).toBe(1);
		expect(result.result.ok).toBe(1);

		const insertedUser = await ToDoList.findOne({name: "task1"});
		expect(insertedUser.name).toEqual(updateMockData.name);
		expect(insertedUser.description).toEqual(updateMockData.description);
		expect(insertedUser.priority).toEqual(updateMockData.priority);
		expect(insertedUser.due_time.toISOString()).toEqual(new Date(updateMockData.due_time).toISOString());
		expect(insertedUser.is_done).toEqual(updateMockData.is_done);
	});

	it("should delete doc in collection", async () => {
		let result = await ToDoList.deleteOne({_id: id});

		expect(result.result.n).toBe(1);
		expect(result.result.ok).toBe(1);
	});

	it("should fail if name is not provided", () => {
		const failedMockData = {
			description: "update task desc",
			priority: "top",
			due_time: 1597235700,
			is_done: true
		};
		expect(() => {
			ToDoList.add(failedMockData);
		}).toThrowError(/^Missing/);
	});
});
