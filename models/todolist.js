"use strict";
const Joi = require("joi");
const MongoModels = require("mongo-models");

const schema = Joi.object({
	_id: Joi.object(),
	name: Joi.string().required(),
	description: Joi.string(),
	priority: Joi.string().required(),
	due_time: Joi.date().timestamp().required(),
	is_done: Joi.boolean(),
	create_time: Joi.date().timestamp(),
	update_time: Joi.date().timestamp(),
});

class ToDoList extends MongoModels {
	static add(payload) {
		const { name, priority, due_time } = payload;

		if (!name) {
			throw new Error("Missing 'name'.");
		}

		if (!priority) {
			throw new Error("Missing 'priority'.");
		}

		if (!due_time) {
			throw new Error("Missing 'due_time'.");
		}

		let obj = payload;
		obj.create_time = new Date();

		if (!obj.name) {delete obj.name;}
		const document = new ToDoList(obj);

		return this.insertOne(document);
	}

	static createIdx(conn) {
		return ToDoList.createIndexes(conn, ToDoList.indexes);
	}
}

ToDoList.indexes = [
	{ key: { name: 1 } },
	{ key: { create_time: 1 } },
];

ToDoList.collectionName = "todolist"; // the mongodb collection name
ToDoList.schema = schema;
module.exports = ToDoList;