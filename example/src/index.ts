import * as Koa from "koa";
import * as Router from "koa-router";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";

const app = new Koa();
const router = new Router();

router.get("/", async (ctx, next) => {
	ctx.body = { message: "Hello world" };
	await next();
});

app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
	console.log("Koa started");
});
