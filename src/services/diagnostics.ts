import type { DiagnosticLog } from "../types";

const logs: DiagnosticLog[] = [];

export const diagnostics = {
  log(level: DiagnosticLog["level"], message: string, context?: DiagnosticLog["context"]) {
    logs.unshift({
      id: `log-${logs.length + 1}`,
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    });
  },
  list() {
    return [...logs];
  }
};
