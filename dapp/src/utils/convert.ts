export function optDecimalString(value?: unknown) {
  try {
    // @ts-ignore next-line
    return BigInt(value).toString();
  } catch (_error) {}
}
