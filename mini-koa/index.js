const Koa = require('./lib/application');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(ctx.req.url);
  console.log(ctx.request.req.url);
  console.log(ctx.response.req.url);
  console.log(ctx.request.url);
  console.log(ctx.request.path);
  console.log(ctx.url);
  console.log(ctx.path);
  await next();
  console.log(5);
  ctx.body = 'hello world';
});
app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
});
app.use(async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
});
app.listen(3000);
