/* This is just an example app, and does not have any best practices applied. */

import * as Koa from "koa";
import * as Router from "koa-router";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";
import Surreal from "surrealdb.js";
import { faker } from "@faker-js/faker";

const app = new Koa();
const router = new Router();
const db = new Surreal(`http://${process.env.SURREAL_URL}/rpc`);

router.get("/", async (ctx, next) => {
	const people = await db.select("person");
	ctx.body = { message: "Hello world", people };
	await next();
});

router.post("/create", async (ctx, next) => {
	await db.create("person", {
		title: faker.name.jobTitle(),
		name: { first: faker.name.firstName(), last: faker.name.lastName() },
		marketing: faker.datatype.boolean(),
		identifier: faker.internet.userName(),
	});
	ctx.body = { status: true };
	await next();
});

app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, async () => {
	console.log("Koa started");
	await db.signin({
		user: process.env.SURREAL_USER,
		pass: process.env.SURREAL_PASS,
	});
	await db.use("test", "test");
});
