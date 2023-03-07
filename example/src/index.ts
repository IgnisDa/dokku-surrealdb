/* This is just an example app, and does not have any best practices applied. */

import * as Koa from "koa";
import * as Router from "koa-router";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";
import Surreal from "surrealdb.js";
import { faker } from "@faker-js/faker";

const config = {
	app: { port: process.env.PORT || 3000 },
	surreal: {
		url: process.env.SURREAL_URL || "localhost:8000",
		user: process.env.SURREAL_USER || "admin",
		pass: process.env.SURREAL_PASS || "password",
	},
} as const;

const app = new Koa();
const router = new Router();

const db = new Surreal(`http://${config.surreal.url}/rpc`);

router.get("/", async (ctx, next) => {
	const people = await db.select("person");
	ctx.body = people;
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

app.listen(config.app.port, async () => {
	await db.signin({
		user: config.surreal.user,
		pass: config.surreal.pass,
	});
	await db.use("test", "test");
	console.info("SurrealDB connected");
	console.log(`Koa started on port ${config.app.port}`);
});
