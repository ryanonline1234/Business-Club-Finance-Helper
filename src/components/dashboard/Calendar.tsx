"use client";

import { useState } from "react";

interface Event {
  date: string;
  name: string;
  type: "meeting" | "event" | "deadline";
  time: string;
}

const EVENTS: Event[] = [
  { date: "2026-03-25", name: "Officer Meeting", type: "meeting", time: "3:00 PM · Room 204" },
  { date: "2026-03-27", name: "Weekly Meeting", type: "meeting", time: "3:00 PM · Auditorium" },
  { date: "2026-03-28", name: "Competition Deadline", type: "deadline", time: "11:59 PM" },
  { date: "2026-04-03", name: "Weekly Meeting", type: "meeting", time: "3:00 PM · Auditorium" },
  { date: "2026-04-08", name: "Goldman Speaker", type: "event", time: "4:00 PM · Cafeteria" },
  { date: "2026-04-10", name: "Weekly Meeting", type: "meeting", time: "3:00 PM · Auditorium" },
  { date: "2026-04-15", name: "Spring Networking", type: "event", time: "5:00 PM · Commons" },
  { date: "2026-04-17", name: "Weekly Meeting", type: "meeting", time: "3:00 PM · Auditorium" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dows = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar() {
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(2);

  const renderCalendar = () => {
    const today = new Date();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevDays = new Date(viewYear, viewMonth, 0).getDate();

    // Generate calendar grid
    const grid: React.ReactNode[] = [];

    // Day of week headers
    dows.forEach((d) => {
      grid.push(
        <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">
          {d}
        </div>
      );
    });

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      grid.push(
        <div key={`prev-${i}`} className="h-20 flex items-start justify-center text-slate-300 text-sm">
          {prevDays - i}
        </div>
      );
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

      const dayEvents = EVENTS.filter((e) => e.date === dateStr);
      const dayContent = (
        <div className="flex flex-col gap-1">
          <div className={`w-6 h-6 flex items-center justify-center text-sm font-medium ${isToday ? "bg-amber-600 text-white rounded-full" : "text-slate-700"}`}>
            {d}
          </div>
          {dayEvents.map((event) => (
            <div
              key={event.name}
              className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap overflow-hidden text-ellipsis ${
                event.type === "meeting"
                  ? "bg-amber-100 text-amber-800"
                  : event.type === "event"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {event.name}
            </div>
          ))}
        </div>
      );

      grid.push(
        <div key={d} className="h-20 border border-slate-100 rounded-lg hover:bg-slate-50 p-2">
          {dayContent}
        </div>
      );
    }

    // Next month fillers
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    for (let i = 1; i <= totalCells - firstDay - daysInMonth; i++) {
      grid.push(
        <div key={`next-${i}`} className="h-20 flex items-start justify-center text-slate-300 text-sm">
          {i}
        </div>
      );
    }

    return grid;
  };

  const changeMonth = (dir: number) => {
    setViewMonth((prev) => {
      const newMonth = prev + dir;
      if (newMonth > 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      if (newMonth < 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return newMonth;
    });
  };

  const renderUpcoming = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = EVENTS.filter(
      (e) => new Date(e.date) >= today
    ).slice(0, 4);

    return upcoming.map((e) => {
      const d = new Date(e.date);
      let tagColors: [string, string] = ["#FFF3CC", "#7A5500"];
      if (e.type === "event") tagColors = ["#E6F1FB", "#185FA5"];
      if (e.type === "deadline") tagColors = ["#FCEBEB", "#A32D2D"];

      return (
        <div key={e.date} className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
          <div className="flex-shrink-0 text-center">
            <div className="text-2xl font-bold text-amber-600 leading-none">{d.getDate()}</div>
            <div className="text-[10px] text-slate-400 uppercase">{months[d.getMonth()].slice(0, 3)}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">{e.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{e.time}</div>
          </div>
          <span
            className="text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap"
            style={{ backgroundColor: tagColors[0], color: tagColors[1] }}
          >
            {e.type}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {months[viewMonth]} {viewYear}
          </h2>
          <p className="text-sm text-slate-500">Event Calendar</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            &lt;
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Upcoming Events
        </h3>
        <div className="space-y-1">{renderUpcoming()}</div>
      </div>
    </div>
  );
}
