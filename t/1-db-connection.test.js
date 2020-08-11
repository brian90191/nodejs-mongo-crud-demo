"use strict";
const {MongoClient} = require("mongodb");


describe("Can insert document to db", () => {
	let connection;
	let db;

	beforeAll(async () => {
		connection = await MongoClient.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		db = await connection.db();
	});

	afterAll(async () => {
		await connection.close();
		await db.close();
	});

	it("should insert a doc into collection", async () => {
		const todolist = db.collection("todolist");

		const mockUser = {_id: "some-user-id", name: "John"};
		await todolist.insertOne(mockUser);

		const insertedUser = await todolist.findOne({_id: "some-user-id"});
		expect(insertedUser).toEqual(mockUser);
	});
});

