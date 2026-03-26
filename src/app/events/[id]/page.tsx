"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { generateEventQRCode } from "@/lib/qrcode";

interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  password: string | null;
  capacity: number | null;
  category: string;
  status: string;
  created_by: {
    name: string;
    email: string;
  };
  attendance_count: number;
  attendance?: {
    id: string;
    member: {
      name: string;
      email: string;
    };
    checked_in_at: string;
    method: string;
  }[];
}

export default function EventDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkInPassword, setCheckInPassword] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [attendance, setAttendance] = useState<Event["attendance"]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);
          fetchAttendance(data.event.id);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendance = async (eventId: string) => {
      try {
        const response = await fetch(`/api/events/${eventId}/attendance`);
        if (response.ok) {
          const data = await response.json();
          setAttendance(data.attendance || []);
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  useEffect(() => {
    if (event?.id) {
      generateEventQRCode(event.id).then(setQrCode);
    }
  }, [event?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">Event not found.</p>
          <Link
            href="/events"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      alert("Please sign in first");
      return;
    }

    setCheckingIn(true);

    try {
      const response = await fetch(`/api/events/${event.id}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: (session.user as { id?: string; sub?: string }).id || (session.user as { id?: string; sub?: string }).sub,
          password: checkInPassword,
        }),
      });

      if (response.ok) {
        alert("Checked in successfully!");
        setCheckInPassword("");
        const updatedResponse = await fetch(`/api/events/${event.id}/attendance`);
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setAttendance(data.attendance || []);
        }
      } else {
        const errorData = await response.json();
        alert(errorData?.error || "Failed to check in");
      }
    } catch (error) {
      alert("Error checking in");
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/events"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Event Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    event.status === "active"
                      ? "bg-green-100 text-green-700"
                      : event.status === "completed"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              {event.description && (
                <p className="text-slate-600">{event.description}</p>
              )}
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">When</p>
                    <p className="font-medium text-slate-900">
                      {new Date(event.start_time).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                      <br />
                      {new Date(event.start_time).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {event.end_time && (
                        <> - {new Date(event.end_time).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</>
                      )}
                    </p>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-medium text-slate-900">{event.location}</p>
                    </div>
                  </div>
                )}
                {event.password && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Meeting Password</p>
                      {showPassword ? (
                        <p className="font-medium text-slate-900">{event.password}</p>
                      ) : (
                        <button
                          onClick={() => setShowPassword(true)}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          Show password
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Check In Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Check In</h2>
            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Meeting Password
                </label>
                <input
                  type="text"
                  value={checkInPassword}
                  onChange={(e) => setCheckInPassword(e.target.value)}
                  placeholder="Enter the event password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={checkingIn || !session}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkingIn ? "Checking in..." : "Check In"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Scan to Check In
            </h2>
            {qrCode ? (
              <div className="flex justify-center mb-4">
                <Image
                  src={qrCode}
                  alt="Event QR Code"
                  width={192}
                  height={192}
                  className="object-contain bg-white p-4 border border-slate-200 rounded-xl"
                />
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
            <p className="text-sm text-slate-500">
              Show this QR code to the event organizer to check in
            </p>
          </div>

          {/* Attendance Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Attendance
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Attended</span>
                <span className="font-bold text-slate-900">
                  {attendance?.length || 0} / {event.capacity || "Unlimited"}
                </span>
              </div>
              {event.created_by && (
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {event.created_by.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Created by {event.created_by.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {event.created_by.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attendance List (Admin only) */}
          {((session?.user as { role?: string })?.role === "admin" || (session?.user as { role?: string })?.role === "treasurer") ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Check-In List
              </h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {attendance?.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No one checked in yet
                  </p>
                ) : (
                  (attendance || []).map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2 border border-slate-100 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">
                          {att.member.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {att.member.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(att.checked_in_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 capitalize">
                        {att.method}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
