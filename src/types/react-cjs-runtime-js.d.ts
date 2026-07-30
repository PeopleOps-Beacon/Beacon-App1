declare module "react/index.js" {
  import type * as ReactModule from "react";
  const runtime: typeof ReactModule;
  export default runtime;
}

declare module "react-dom/client.js" {
  import type * as ReactDomClientModule from "react-dom/client";
  const runtime: typeof ReactDomClientModule;
  export default runtime;
}
