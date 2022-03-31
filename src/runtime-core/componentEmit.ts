import { camelize, toHandlerKey } from '../shared/index';
export function emit(instance, event, ...args) {
  const { props } = instance;

  const hanlerName = toHandlerKey(camelize(event));
  const handler = props[hanlerName];

  handler && handler(...args);
}