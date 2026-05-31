import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  type?: "page" | "skeleton" | "spinner";
  rows?: number;
}

export function LoadingState({ type = "spinner", rows = 3 }: LoadingStateProps) {
  if (type === "page") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <Loader2 className="w-8 h-8 text-primary-blue animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-ink">Loading content, please wait...</p>
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className="space-y-4 w-full animate-pulse my-4">
        <div className="h-8 bg-surface-soft rounded-lg w-1/4" />
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-12 bg-surface-soft rounded-xl w-full border border-border/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-6 h-6 text-primary-blue animate-spin" />
    </div>
  );
}
