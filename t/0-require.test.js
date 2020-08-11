"use strict";
var appRoot = require("app-root-path");
const MongoModels = require("mongo-models");

const ToDoList = require(appRoot + "/models/todolist");


describe("Model is correct model", () => {
	let connection;

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

	it("Can require model and create instance", () => {
		expect(typeof ToDoList).toBe("function");
		expect(ToDoList.name).toBe("ToDoList");
	});
});
