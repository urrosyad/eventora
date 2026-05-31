import { EventStatus, SponsorshipStatus } from "@/types";

interface StatusBadgeProps {
  status: EventStatus | SponsorshipStatus;
  type?: "event" | "sponsorship";
}

export function StatusBadge({ status, type = "sponsorship" }: StatusBadgeProps) {
  let label = status.toString();
  let dotColor = "bg-silver";
  let borderColor = "border-border-strong";
  let textColor = "text-muted-ink";

  if (type === "sponsorship") {
    switch (status) {
      case "pending":
        label = "Pending";
        dotColor = "bg-warning";
        borderColor = "border-warning/30";
        textColor = "text-warning";
        break;
      case "reviewed":
        label = "Reviewed";
        dotColor = "bg-accent-blue";
        borderColor = "border-accent-blue/30";
        textColor = "text-accent-blue";
        break;
      case "accepted":
        label = "Accepted";
        dotColor = "bg-success";
        borderColor = "border-success/30";
        textColor = "text-success";
        break;
      case "rejected":
        label = "Rejected";
        dotColor = "bg-danger";
        borderColor = "border-danger/30";
        textColor = "text-danger";
        break;
      case "cancelled":
        label = "Cancelled";
        dotColor = "bg-silver";
        borderColor = "border-border-strong";
        textColor = "text-muted-ink";
        break;
    }
  } else {
    // Event status mapping
    switch (status) {
      case "draft":
        label = "Draft";
        dotColor = "bg-silver";
        borderColor = "border-border-strong";
        textColor = "text-muted-ink";
        break;
      case "active":
        label = "Active";
        dotColor = "bg-success";
        borderColor = "border-success/30";
        textColor = "text-success";
        break;
      case "archived":
        label = "Archived";
        dotColor = "bg-silver";
        borderColor = "border-border-strong";
        textColor = "text-muted-ink";
        break;
      case "hidden":
        label = "Hidden";
        dotColor = "bg-warning";
        borderColor = "border-warning/30";
        textColor = "text-warning";
        break;
      case "removed":
        label = "Removed";
        dotColor = "bg-danger";
        borderColor = "border-danger/30";
        textColor = "text-danger";
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${borderColor} ${textColor} bg-white shadow-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      {label}
    </span>
  );
}
