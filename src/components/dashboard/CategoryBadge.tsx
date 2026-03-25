"use client";

interface CategoryBadgeProps {
  category?: {
    name: string;
    slug: string;
    icon: string;
  };
  status?: string;
}

export function CategoryBadge({ category, status }: CategoryBadgeProps) {
  const categoryColors: Record<string, string> = {
    budget: "bg-blue-100 text-blue-700",
    activities: "bg-green-100 text-green-700",
    prizes: "bg-purple-100 text-purple-700",
    snacks: "bg-orange-100 text-orange-700",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const categoryColor = category && category.slug ? categoryColors[category.slug] : null;
  const statusColor = status ? statusColors[status] : null;

  return (
    <div className="flex items-center gap-2">
      {category && (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor || "bg-slate-100 text-slate-700"}`}>
          {category.name}
        </span>
      )}
      {status && (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor || "bg-slate-100 text-slate-700"}`}>
          {status}
        </span>
      )}
    </div>
  );
}
