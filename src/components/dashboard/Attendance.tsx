"use client";

import { useState } from "react";

interface AttendanceRecord {
  name: string;
  role: string;
  status: "present" | "absent" | "late";
  time: string;
}

const attendanceData: AttendanceRecord[] = [
  { name: "Sarah Kim", role: "President", status: "present", time: "3:01 PM" },
  { name: "James Liu", role: "VP Finance", status: "present", time: "3:04 PM" },
  { name: "Priya Nair", role: "Secretary", status: "late", time: "3:18 PM" },
  { name: "Marcus Webb", role: "Treasurer", status: "present", time: "2:58 PM" },
  { name: "Aiko Tanaka", role: "Officer", status: "absent", time: "-" },
  { name: "Devon Hall", role: "Officer", status: "present", time: "3:02 PM" },
  { name: "Luna Reyes", role: "Officer", status: "present", time: "3:00 PM" },
];

const statusStyles = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
};

export function Attendance() {
  const [selectedEvent, setSelectedEvent] = useState("Weekly Meeting — Mar 20");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = attendanceData.filter(
    (record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgAttendance = 87;
  const totalMembers = 24;
  const meetingsHeld = 12;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl font-semibold text-slate-900">{avgAttendance}%</div>
          <div className="text-xs text-slate-500 mt-1">Avg Attendance</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl font-semibold text-slate-900">{totalMembers}</div>
          <div className="text-xs text-slate-500 mt-1">Total Members</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <div className="text-2xl font-semibold text-slate-900">{meetingsHeld}</div>
          <div className="text-xs text-slate-500 mt-1">Meetings Held</div>
        </div>
      </div>

      <div className="flex gap-3">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Weekly Meeting — Mar 20</option>
          <option>Weekly Meeting — Mar 13</option>
          <option>Speaker Event — Mar 5</option>
        </select>
        <input
          type="text"
          placeholder="Search member..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((record, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{record.name}</td>
                <td className="px-4 py-3 text-slate-600">{record.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[record.status]}`}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{record.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500">
            No members found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
