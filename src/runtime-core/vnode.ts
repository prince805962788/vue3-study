
import { ShapeFlags } from "../shared/shapeFlags";
export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export { createVNode as createElementVNode };

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlags: getShapeFlag(type),
    el: null,
  };

  if (typeof children === 'string') {
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.ARRAY_CHILDREN;
  }
  // 组件 + children object
  if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlags |= ShapeFlags.SLOTS_CHILDREN;
    }
  }

  return vnode;
}
export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}
function getShapeFlag(type: string) {
  return typeof type === 'string'
  ? ShapeFlags.ELEMENT
  : ShapeFlags.STATEFUL_COMPONENT;
}