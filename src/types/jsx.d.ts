// Temporary JSX typings shim to unblock IntrinsicElements resolution
// If React types fail to load in your editor, this prevents cascading errors.
// Prefer fixing tsconfig/types installation; remove this file once resolved.
declare namespace JSX {
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface IntrinsicElements {
    [elemName: string]: any
  }
}




