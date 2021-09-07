const proto = {}; // proto同源码定义的变量名
// 创建一个defineGetter函数，参数分别是要代理的对象和对象上的属性
function defineGetter(prop, name) {
  // 每个对象都有一个__defineGetter__方法，可以用这个方法实现代理
  proto.__defineGetter__(name, function () {
    return this[prop][name]; //这里的this是ctx,所以ctx.url得到的就是this.request.url
  });
}
function defineSetter(prop, name) {
  proto.__defineSetter__(name, function (val) {
    this[prop][name] = val;
  });
}
// 对 this.request下的url,path,body做获取代理
defineGetter('request', 'url');
defineGetter('request', 'path');
defineGetter('response', 'body');
// 对 this.response下的body做设置代理
defineSetter('response', 'body');
module.exports = proto;
