import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  processComponent(vnode, container);
}
// 处理组件
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
// 挂载组件
function mountComponent(vnode: any, container: any) {
  // 构建vnode实例
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
// 执行setup的render
function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();
  // 递归对子树做相同的patch做操
  patch(subTree, container);
}
