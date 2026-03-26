"use client";

interface Announcement {
  title: string;
  body: string;
  author: string;
  date: string;
}

const announcements: Announcement[] = [
  {
    title: "Case competition signups close Friday",
    body: "Remind all members to register for the Spring Case Competition by March 28. Teams of 3–4, registration link in the GroupMe.",
    author: "Sarah Kim",
    date: "Mar 23, 2026",
  },
  {
    title: "Guest speaker confirmed — April 8",
    body: "We've confirmed a speaker from Goldman Sachs for our April 8 meeting. Please send any Q&A questions to the officer email by April 5.",
    author: "James Liu",
    date: "Mar 20, 2026",
  },
  {
    title: "Officer meeting — Thursday 3 PM",
    body: "Mandatory officer check-in this Thursday in Room 204. We'll review event planning for the rest of the semester and delegate tasks.",
    author: "Sarah Kim",
    date: "Mar 18, 2026",
  },
];

export function Announcements() {
  return (
    <div className="space-y-6">
      <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
        <span>+</span> New announcement
      </button>

      <div className="space-y-4">
        {announcements.map((announce, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-amber-500"
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              {announce.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {announce.body}
            </p>
            <div className="text-xs text-slate-400 mt-4">
              Posted by {announce.author} · {announce.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
