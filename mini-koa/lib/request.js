const url = require('url');
const request = {
  get url() {
    return this.req.url; // 这样就可以用ctx.request.url上取值了，不用通过原生的req
  },
  get path() {
    return url.parse(this.req.url).pathname;
  },
  get query() {
    return url.parse(this.req.url).query;
  },
};
module.exports = request;
