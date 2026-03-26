"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { name: "Calendar", icon: "calendar", href: "/calendar" },
  { name: "Attendance", icon: "attendance", href: "/attendance" },
  { name: "Members", icon: "members", href: "/members" },
  { name: "Events", icon: "events", href: "/events" },
];

const iconMap: Record<string, React.ReactNode> = {
  dashboard: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 4l6-3m0 0l6 3m-6-3v10" />
    </svg>
  ),
  calendar: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2" width="14" height="13" rx="2" />
      <line x1="5" y1="1" x2="5" y2="4" />
      <line x1="11" y1="1" x2="11" y2="4" />
      <line x1="1" y1="6" x2="15" y2="6" />
    </svg>
  ),
  attendance: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 7a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M1 14s-1-5 5-5 5 5 5 5" />
      <path d="M12 6l1.5 1.5L16 5" />
    </svg>
  ),
  members: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="5" r="3" />
      <path d="M1 14c0-3 2.5-5 5-5s5 2 5 5" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 10c1.5 0 3 .8 3 3" />
    </svg>
  ),
  events: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12v7a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
      <path d="M2 4l6 5 6-5" />
    </svg>
  ),
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-52 min-w-[200px] bg-slate-50 border-r border-slate-200 flex flex-col p-4">
      <div className="px-4 pb-5 border-b border-slate-200 mb-3">
        <div className="text-sm font-semibold text-slate-900 leading-tight">
          Mitty Business Club
        </div>
        <div className="text-xs text-slate-500 mt-1">Officer Portal</div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-l-md transition-colors ${
                isActive
                  ? "bg-white text-amber-700 border-l-4 border-amber-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {iconMap[item.icon] || iconMap["dashboard"]}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200 px-4">
        <div className="text-sm font-medium text-slate-900">Sarah K.</div>
        <div className="text-xs text-slate-500">President</div>
      </div>
    </div>
  );
}
