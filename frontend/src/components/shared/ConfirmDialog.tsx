import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full overflow-hidden p-6 animate-scale-up">
        {/* Header */}
        <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
        
        {/* Description */}
        <div className="text-sm text-muted-ink mb-6 leading-relaxed">
          {description}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-border text-ink bg-white hover:bg-surface-soft disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white disabled:opacity-50 transition-all ${
              isDanger
                ? "bg-danger hover:bg-danger/90"
                : "bg-primary-blue hover:bg-primary-blue/90"
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
