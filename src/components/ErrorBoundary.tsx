import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { analytics } from "../services/analytics";
import { diagnostics } from "../services/diagnostics";
import { ErrorService } from "../services/ErrorService";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    ErrorService.capture(error, "component", errorInfo.componentStack?.slice(0, 240) ?? "unknown");
    diagnostics.log("error", "Application error recovered", {
      message: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 240) ?? "unknown"
    });
    analytics.track("error_captured", { area: "react", message: error.message.slice(0, 120) });
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="min-h-screen bg-[#07090b] text-slate-50">
        <section className="app-shell error-recovery-shell">
          <div className="error-recovery-panel" role="alert">
            <TriangleAlert aria-hidden="true" />
            <p className="eyebrow">Recovery Mode</p>
            <h1>Beacon stayed online</h1>
            <p>
              A screen failed to render, so Beacon preserved the session and opened this recovery view instead
              of crashing.
            </p>
            {this.state.message ? <small>{this.state.message}</small> : null}
            <button onClick={this.handleReset} type="button">
              <RotateCcw aria-hidden="true" />
              Try again
            </button>
          </div>
        </section>
      </main>
    );
  }
}
