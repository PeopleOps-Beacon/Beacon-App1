import runtime from "react/jsx-runtime.js";

const jsxRuntime = runtime as typeof runtime & {
  Fragment: unknown;
  jsx: unknown;
  jsxs: unknown;
};

export const Fragment = jsxRuntime.Fragment;
export const jsx = jsxRuntime.jsx;
export const jsxs = jsxRuntime.jsxs;

export default runtime;
