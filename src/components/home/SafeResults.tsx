// src/components/home/SafeResults.tsx
import { Component, type ReactNode } from "react";
import ResultsSection from "./ResultsSection";

class ResultsBoundary extends Component<{ children: ReactNode }, { hasError: boolean; err?: any }> {
  state = { hasError: false, err: null as any };
  static getDerivedStateFromError(err: any) { return { hasError: true, err }; }
  render() {
    if (this.state.hasError) {
      return <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
        Something went wrong while rendering events.
      </div>;
    }
    return this.props.children;
  }
}

export default function SafeResults(props: any) {
  return (
    <ResultsBoundary>
      <ResultsSection {...props} />
    </ResultsBoundary>
  );
}