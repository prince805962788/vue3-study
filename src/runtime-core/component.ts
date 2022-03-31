
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentsPublicInstance";
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    emit: () => {}
  };

  component.emit = emit.bind(null, component) as any;
  return component;
}
// 处理setup的组件
export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  // initSlots()

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
    // props只读，使用shallowReadonly
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });

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
