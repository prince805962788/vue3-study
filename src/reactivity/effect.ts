import { extend } from "../shared";

let activeEffect; //当前的副作用函数
let shouldTrack; //是否应该收集依赖
export class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  public scheduler: Function | undefined;
  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    // 已经收集过依赖了，不在收集，直接执行
    if (!this.active) {
      return this._fn();
    }
    // 还没有收集过依赖，shouldTrack设置为true，执行_fn()，访问并允许后续的依赖收集
    shouldTrack = true;
    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this;
    // 执行_fn()，进行依赖收集，并获取返回结果
    const result = this._fn();
    // 已经进行过依赖收集，shouldTrack设置为false，不在允许后续访问的时候继续依赖收集
    shouldTrack = false;
    return result;
  }
  stop() {
    // 为了防止重复的调用，执行 stop 逻辑
    if (this.active) {
      cleanupEffect(this);
      // 如果有onStop，执行onStop的回调
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  // 找到所有依赖这个 effect 的响应式对象
  // 从这些响应式对象里面把 effect 给删除掉
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}
const targetMap = new Map();
//依赖收集
export function track(target, key) {
  if (!isTracking()) {
    return;
  }
  // console.log(`触发 track -> target: ${target} type:${type} key:${key}`);
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffect(dep);
}
// track在reactive,ref依赖收集逻辑复用
export function trackEffect(dep) {
  // dep中已存在，那么就不添加了
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect); // 把当前副作用函数放入访问的此对象的依赖收集中
  activeEffect.deps.push(dep); //当前副作用函数反向收集
}
export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}
//执行依赖收集中的副作用函数
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  triggerEffect(dep);
}
// trigger在reactive,ref依赖收集逻辑复用
export function triggerEffect(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      // 存在调度程序scheduler，执行
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options); //里面的onStop赋值传递给_effect

  _effect.run(); //执行一遍传入的副作用函数

  const runner: any = _effect.run.bind(_effect); //run函数绑定ReactiveEffect实例的this
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
