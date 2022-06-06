
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";
import { PublicInstanceProxyHandlers } from "./componentsPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    emit: () => {}
  };

  // 赋值 emit
  // 这里使用 bind 把 instance 进行绑定
  // 后面用户使用的时候只需要给 event 和参数即可
  component.emit = emit.bind(null, component) as any;
  return component;
}
// 处理setup的组件
export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}
// 对具备setup状态组件的处理
function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  // 给instance下的一个{_: instance}对象设置代理，当访问这个对象的某个key值的时候，就会去setup返回的对象中找个key，如果存在，返回对应的值
  const proxy = { _: instance };

  instance.proxy = new Proxy(proxy, PublicInstanceProxyHandlers);
  // 从组件中取到setup
  const { setup } = Component;

  if (setup) {
    setCurrentInstance(instance);
    // props只读，使用shallowReadonly
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });

    setCurrentInstance(null);

    handlerSetupResult(instance, setupResult);
  }
}
// 处理setup的结果
function handlerSetupResult(instance, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
// 完成setup处理
function finishComponentSetup(instance) {
  const Component = instance.vnode.type;

  if (Component.render) {
    instance.render = Component.render;
  }
}
// 当前组件实例
let currentInstance = null;
// 获取当前组件实例

export function getCurrentInstance() {
  return currentInstance;
}
// 封装到函数中，方便调试
export function setCurrentInstance(instance) {
  currentInstance = instance;
}