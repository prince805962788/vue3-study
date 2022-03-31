export function initProps(instance, rawProps) {
  // rawProps是只读的
  instance.props = rawProps || {};
}