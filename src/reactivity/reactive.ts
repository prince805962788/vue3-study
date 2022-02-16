import { mutableHandlers, readonlyHandlers } from "./baseHandler";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadOnly",
}
// 创建响应式
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}
// 创建只读
export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}
// 是否响应式
export function isReactive(value) {
  // 如果是响应式，读取响应式里的__v_isReactive，触发get，返回true
  // 如果不是响应式，value.__v_isReactive为undefined，!!将其转为false
  return !!value[ReactiveFlags.IS_REACTIVE];
}
// 是否只读
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

function createActiveObject(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
