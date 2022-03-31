import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from './foo.js';

export const App = {
  render() {
    return h("div", {}, [
      h("div", {}, 'div'),
      h(Foo, {
        count:1,
        onAdd(a, b) {
          console.log('onAdd', a, b);
        },
        onAddFoo(a, b) {
          console.log('onAddFoo', a, b);
        }
      })
    ]);
  },
  setup() {
    return {
      msg: "mini-vue hh",
    };
  },
};
