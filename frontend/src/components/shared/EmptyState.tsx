import { ReactNode } from "react";
import { Info } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 border border-dashed border-border rounded-xl bg-white/50 backdrop-blur-sm max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center text-muted-ink mb-4 border border-border">
        {icon || <Info className="w-5 h-5 text-silver" />}
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-muted-ink max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm hover:shadow transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
