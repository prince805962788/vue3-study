const Koa = require('./lib/application');
const app = new Koa();

app.use((ctx) => {
  console.log(ctx.req.url);
  console.log(ctx.request.req.url);
  console.log(ctx.response.req.url);
  console.log(ctx.request.url);
  console.log(ctx.request.path);
  console.log(ctx.url);
});
app.listen(3000);
