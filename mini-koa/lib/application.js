const http = require('http');
const EventEmitter = require('events');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Koa extends EventEmitter {
  constructor() {
    super();
    this.fn;
    this.context = context; // 将三个模块保存，全局的放到实例上
    this.request = request;
    this.response = response;
  }
  use(fn) {
    this.fn = fn; // 用户使用use方法时，回调赋给this.fn
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
    const ctx = this.createContext(req, res); //创建上下文ctx
    this.fn(ctx); // 调用用户给的回调，把ctx还给用户使用。
    res.end(ctx.body); // ctx.body用来输出到页面
  }
  listen(...args) {
    let server = http.createServer(this.handleRequest.bind(this)); // 这里使用bind调用，以防this丢失
    server.listen(...args); // 因为listen方法可能有多参数，所以这里直接解构所有参数就可以了
  }
}
module.exports = Koa;
