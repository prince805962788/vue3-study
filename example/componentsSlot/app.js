

import { createTextVNode, getCurrentInstance, h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from './foo.js';

export const App = {
  render() {
    const app = h('div', {}, "app");
    const foo = h(
      Foo,
      {},
      {
        header:({ age }) => [ h('p', {}, 'header' + age), createTextVNode('你好啊') ],
        footer:({ age }) => h('p', {}, 'footer' + age)
      }
    );

    return h("div", {}, [ app, foo ]);
  },
  setup() {
    const current = getCurrentInstance();

    console.log(current);

    return {
      msg: "mini-vue hh",
    };
  },
};
