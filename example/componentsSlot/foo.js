import { getCurrentInstance, h, renderSlots } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  render() {
    const foo = h("p", {}, "foo");

    return h('div', {}, [
      renderSlots(this.$slots, "header", { age:3 }),
      foo,
      renderSlots(this.$slots, "footer", { age:4 })
    ]);
  },
  setup(props, { emit }) {
    const current = getCurrentInstance();

    console.log(current);
    return {};
  },
};