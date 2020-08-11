// cSpell:enableCompoundWords
// eslint-disable-next-line no-unused-vars
// var colors = require("colors");

module.exports = function () {
	return {
		mongo: {
			// uri: "mongodb://mongo",
			uri: "mongodb://localhost:27017",
			db: "todolist",
		},
		trusted_source_ip: [
			"127.0.0.1",
			"172.17.0.1",
			"172.18.0.1",
			"172.19.0.1",
			"172.20.0.1",
			"::1",
			"::ffff:127.0.0.1",
			"::ffff:172.20.0.1",
			"::ffff:172.18.0.1",
		],
	};
};
