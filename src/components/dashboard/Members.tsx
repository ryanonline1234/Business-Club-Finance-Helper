"use client";

interface Member {
  name: string;
  role: string;
  initials: string;
  color: string;
}

const members: Member[] = [
  { name: "Sarah Kim", role: "President", initials: "SK", color: "bg-amber-100 text-amber-700" },
  { name: "James Liu", role: "VP Finance", initials: "JL", color: "bg-blue-100 text-blue-700" },
  { name: "Priya Nair", role: "Secretary", initials: "PN", color: "bg-green-100 text-green-700" },
  { name: "Marcus Webb", role: "Treasurer", initials: "MW", color: "bg-amber-100 text-amber-700" },
  { name: "Aiko Tanaka", role: "Officer", initials: "AT", color: "bg-emerald-100 text-emerald-700" },
  { name: "Devon Hall", role: "Officer", initials: "DH", color: "bg-purple-100 text-purple-700" },
  { name: "Luna Reyes", role: "Officer", initials: "LR", color: "bg-orange-100 text-orange-700" },
  { name: "Ben Torres", role: "Officer", initials: "BT", color: "bg-gray-200 text-gray-600" },
];

const roleColors: Record<string, string> = {
  President: "bg-amber-100 text-amber-700",
  "VP Finance": "bg-blue-100 text-blue-700",
  Secretary: "bg-green-100 text-green-700",
  Treasurer: "bg-amber-100 text-amber-700",
  Officer: "bg-slate-100 text-slate-600",
};

export function Members() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          8 officers · Spring 2026
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
          <span>+</span> Add officer
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {members.map((member) => (
          <div
            key={member.name}
            className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 hover:border-amber-200 transition-colors"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${member.color}`}>
              {member.initials}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900">{member.name}</div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block"
                style={{ backgroundColor: roleColors[member.role].split(" ")[0], color: roleColors[member.role].split(" ")[1] }}
              >
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
