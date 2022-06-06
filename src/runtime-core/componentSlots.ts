
import { ShapeFlags } from "../shared/shapeFlags";

export function initSlots(instance, children) {
  const { vnode } = instance;

  if (vnode.shapeFlags & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots = {});
  }
}
const normalizeObjectSlots = (rawSlots, slots) => {
  for (const key in rawSlots) {
    const value = rawSlots[key];

    slots[key] =  (props) => normalizeSlotValue(value(props));
  }
};

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [ value ];
}