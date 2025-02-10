export function callUnstableFunc<F extends Function, R = null>(
  fn: F,
  args?: unknown[],
) {
  try {
    return fn(...(args ?? [])) as R;
  } catch (err) {
    console.log(err);
  }
  return null;
}