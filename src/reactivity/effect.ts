import { extend } from "../shared";

class ReactiveEffect {
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
    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this;
    return this._fn();
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
  dep.add(activeEffect); // 把当前副作用函数放入访问的此对象的依赖收集中
  activeEffect.deps.push(dep); //当前副作用函数反向收集
}
export function isTracking() {
  return activeEffect !== undefined;
}
//执行依赖收集中的副作用函数
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect; //当前的副作用函数
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
