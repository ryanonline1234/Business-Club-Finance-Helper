interface CategoryBadgeProps {
  category: {
    name: string;
    slug: string;
    icon: string;
  };
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colors: Record<string, string> = {
    budget: "bg-blue-100 text-blue-800",
    activities: "bg-green-100 text-green-800",
    prizes: "bg-purple-100 text-purple-800",
    snacks: "bg-orange-100 text-orange-800",
  };

  const color = colors[category.slug] || "bg-slate-100 text-slate-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {category.name}
    </span>
  );
}
