import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";
// ref针对一个基本类型
// proxy只针对一个对象
// 所以ref需要一层类去包裹，通过原生的get,set方法去截获
class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  constructor(value) {
    // 原始对象，用于后续的对比操作
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    // 如果赋值和原有的相同，那么不触发后续的副作用函数
    // 2个普通对象对比
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      // 一定是先修改了value的值再去触发副作用函数
      this._value = convert(newValue);
      triggerEffect(this.dep);
    }
  }
}
// 如果value是一个对象的话，那么使用reactive处理
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}
// 存在当前副作用函数，那么触发依赖收集
function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

export function ref(value) {
  return new RefImpl(value);
}
