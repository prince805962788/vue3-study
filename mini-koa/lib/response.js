const response = {
  get body() {
    return this._body; // get时返回出去
  },
  set body(value) {
    this.res.statusCode === 200; // 只要设置了body,就应该吧状态码设置为200
    this._body = value;
  },
};
module.exports = response;
