export function createComponentInstance(vnode) {
  const component = {
    vnode,
  };
  return component;
}
// 处理setup的组件
export function setupComponent(instance) {
  // initProps()
  // initSlots()

  setupStatefulComponent(instance);
}
// 对具备setup状态组件的处理
function setupStatefulComponent(instance: any) {
  const Component = instance.vnode.type;
  // 从组件中取到setup
  const { setup } = Component;
  if (setup) {
    const setupResult = setup();

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
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
