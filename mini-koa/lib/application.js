const http = require('http');
const EventEmitter = require('events');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const { Stream } = require('stream');

class Koa extends EventEmitter {
  constructor() {
    super();
    this.middlewares = []; // 中间件储存的数组
    this.context = context; // 将三个模块保存，全局的放到实例上
    this.request = request;
    this.response = response;
  }
  use(fn) {
    this.middlewares.push(fn); // 当前回调放入数组
  }
  // 简化版compose，接受中间件数组，ctx作为参数
  compose(middlewares, ctx) {
    // 利用递归函数将各中间件串联起来依次调用
    function dispatch(index) {
      if (index === middlewares.length) return Promise.resolve; // 若是最后一个中间件的后一个下标，说明所有中间件执行完毕，返回一个resolve的promise
      let middleware = middlewares[index];
      return Promise.resolve(middleware(ctx, () => dispatch(index + 1))); // 调用并传入ctx和下一个将被调用的函数，用户next()时执行该函数
    }
    return dispatch(0);
  }
  createContext(req, res) {
    // 使用Object.create方法是为了继承this.context但在增加属性时不影响原对象
    const ctx = Object.create(this.context);
    const request = (ctx.request = Object.create(this.request)); // 把request请求对象放入ctx上下文中
    const response = (ctx.response = Object.create(this.response)); // 把response返回对象放入ctx上下文中
    // 让ctx,request,response都携带上下文
    ctx.req = request.req = response.req = req;
    ctx.res = request.res = response.res = res;
    request.ctx = response.ctx = ctx;
    response.request = request;
    request.response = response;
    return ctx;
  }
  // 创建一个处理请求的函数
  handleRequest(req, res) {
    res.statusCode = 404; // 默认404
    const ctx = this.createContext(req, res); //创建上下文ctx
    let fn = this.compose(this.middlewares, ctx); // 调用compose，递归执行所有中间件函数，直到最后一个中间件执行完毕返回resolve
    fn.then(() => {
      if (typeof ctx.body === 'object') {
        // 如果是个对象，按json形式输出
        res.setHeader('Content-type', 'application/json;charset=utf8');
        res.end(JSON.stringify(ctx.body));
      } else if (ctx.body instanceof Stream) {
        // 如果是流,而且不能终断end
        ctx.body.pipe(res);
      } else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
        // 如果是字符串或者buffer
        res.setHeader('Content-type', 'text/htmlcharset=utf8');
        res.end(ctx.body);
      } else {
        res.end('Not found');
      }
    }).catch((err) => {
      this.emit('error', err);
      res.statusCode === 500;
      res.end('server error');
    });
  }
  listen(...args) {
    let server = http.createServer(this.handleRequest.bind(this)); // 这里使用bind调用，以防this丢失
    server.listen(...args); // 因为listen方法可能有多参数，所以这里直接解构所有参数就可以了
  }
}
module.exports = Koa;
