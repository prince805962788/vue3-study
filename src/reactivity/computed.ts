import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: any;
  private _dirty: boolean = true;
  private _value: any; //缓存value值
  private _effect: any;
  constructor(getter) {
    this._getter = getter;
    // 副作用函数的收集
    // 传入的getter暂时先不会执行，在后续用get value操作访问的时候再执行
    this._effect = new ReactiveEffect(getter, () => {
      // 依赖收集中的trigger过程触发
      // 因为内部依赖的响应式发生了改变，_dirty -> false，下次访问的时候，重新执行改变的effect
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    // 访问value，dirty -> true
    // 当依赖的响应式对象的值改变时候，触发effect
    if (this._dirty) {
      this._dirty = false; //已经调用一次了，dirty变为false
      this._value = this._effect.run(); //取到最新的值并执行上面的scheduler，将dirty设置为true
    }
    return this._value;
  }
}
export function computed(getter) {
  return new ComputedRefImpl(getter);
}
