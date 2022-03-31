export const extend = Object.assign;
export const isObject = (val) => {
  return val !== null && typeof val === "object";
};
export const hasChanged = (newValue, oldValue) => {
  return !Object.is(newValue, oldValue);
};
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

// 转义为驼峰：add-foo => addFoo
export const camelize = (str:string) => {
  return str.replace(/-(\w)/g, (_, c:string) => c ? c.toUpperCase() : "");
};
// 转义第一个大写：add => Add
export const capitalize = (str:string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// 转义为事件名：add => onAdd
export const toHandlerKey = (str:string) => {
  return str ? 'on' + capitalize(str) : "";
};