import runtime from "react-dom/client.js";

const ReactDomClientRuntime = runtime as Record<string, unknown>;

export const createRoot = ReactDomClientRuntime.createRoot;
export const hydrateRoot = ReactDomClientRuntime.hydrateRoot;
export const version = ReactDomClientRuntime.version;

export default runtime;
