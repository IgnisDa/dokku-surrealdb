import * as Koa from "koa";
import * as Router from "koa-router";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";
import Surreal from "surrealdb.js";

const app = new Koa();
const router = new Router();
const db = new Surreal(`http://${process.env.SURREAL_URL}/rpc`);

router.get("/", async (ctx, next) => {
	await db.signin({
		user: process.env.SURREAL_USER,
		pass: process.env.SURREAL_PASS,
	});
	await db.create("person", {
		title: "Founder & CEO",
		name: { first: "Tobie", last: "Morgan Hitchcock" },
		marketing: true,
		identifier: Math.random().toString(36).substr(2, 10),
	});
	const people = await db.select("person");
	ctx.body = { message: "Hello world", people };
	await next();
});

app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, () => {
	console.log("Koa started");
});
