import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转为虚拟节点vnode
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    },
  };
}
