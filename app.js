const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const appRoot = require("app-root-path");
const conf = require(appRoot + "/config.js")();
const RouterVenderData = require(appRoot + "/routes/todolist.js");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(methodOverride());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	let source_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

	if (conf.trusted_source_ip.includes(source_ip)) {
		req.trusted_source_ip = source_ip;
	}
	next();
});

app.use("/", require("./routes/index"));
app.use("/todolist", RouterVenderData);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
