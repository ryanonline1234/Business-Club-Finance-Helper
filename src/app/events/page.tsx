import EventsClient from "@/app/events/EventsClient";

// Force dynamic rendering for this page in Next.js 16
export const dynamic = "force-dynamic";

export default function EventsPage() {
  return <EventsClient />;
}
