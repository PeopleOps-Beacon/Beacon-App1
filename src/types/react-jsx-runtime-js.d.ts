declare module "react/jsx-runtime.js" {
  import type * as Runtime from "react/jsx-runtime";
  const runtime: typeof Runtime;
  export default runtime;
}

declare module "react/jsx-dev-runtime.js" {
  import type * as Runtime from "react/jsx-dev-runtime";
  const runtime: typeof Runtime;
  export default runtime;
}
