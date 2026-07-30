import runtime from "react/jsx-dev-runtime.js";

const jsxDevRuntime = runtime as typeof runtime & {
  Fragment: unknown;
  jsxDEV: unknown;
};

export const Fragment = jsxDevRuntime.Fragment;
export const jsxDEV = jsxDevRuntime.jsxDEV;

export default runtime;
