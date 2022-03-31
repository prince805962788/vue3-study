import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "../shared/shapeFlags";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  // todo 判断vnode是不是一个element
  const { shapeFlags } = vnode;

  if (shapeFlags & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
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
  const { children, props, shapeFlags } = vnode;
  // 判断子类型

  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    // 文本类型
    el.textContent = children;
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    // 数组类型
    mountChildren(vnode, el);
  }
  // 处理属性和事件
  const isOn = (key:string) => /^on[A-Z]/.test(key);

  for (const key in props) {
    const val = props[key];

    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();

      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
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
