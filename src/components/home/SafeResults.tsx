// src/components/home/SafeResults.tsx
import { Component, type ReactNode } from "react";
import ResultsSection from "./ResultsSection";

type ResultsSectionProps = React.ComponentProps<typeof ResultsSection>;

class ResultsBoundary extends Component<
  { children: ReactNode; resetKey?: unknown },
  { hasError: boolean; err?: unknown }
> {
  state = { hasError: false, err: undefined as unknown };

  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, err };
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    if (import.meta.env.DEV) {
      // Helpful in dev; silent in prod
      // eslint-disable-next-line no-console
      console.error("[ResultsBoundary]", error, info.componentStack);
    }
  }

  componentDidUpdate(prevProps: Readonly<{ resetKey?: unknown }>) {
    // Reset the boundary when the upstream data identity changes
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, err: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-rose-700"
        >
          <div className="font-medium">Couldn’t render the results.</div>
          <div className="text-sm opacity-90">
            Try refreshing, or run another extraction.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function SafeResults(props: ResultsSectionProps & { className?: string }) {
  const { data, className, ...rest } = props;
  return (
    <div className={className}>
      <ResultsBoundary resetKey={data}>
        <ResultsSection data={data} {...rest} />
      </ResultsBoundary>
    </div>
  );
}