import { createComponentInstance, setupComponent } from "./component";
import { isObject } from "../shared";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  // todo 判断vnode是不是一个element
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}
// 处理元素类型
function processElement(vnode: any, container: any) {
  mountedElement(vnode, container);
}
// 挂载元素
function mountedElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));
  const { children, props } = vnode;
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}
// 挂载子节点
function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}
// 处理组件
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
// 挂载组件
function mountComponent(initialVNode: any, container: any) {
  // 构建vnode实例
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}
// 执行setup的render
function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  // 从instance中取出setup的返回对象
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  // 递归对子树做相同的patch做操
  patch(subTree, container);
  // 所有的element已经处理完成，此时的subTree就是当前setup返回实例的根节点
  initialVNode.el = subTree.el;
}
