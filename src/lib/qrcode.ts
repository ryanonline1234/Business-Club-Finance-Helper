import qr from "qrcode";

export async function generateEventQRCode(eventId: string): Promise<string> {
  const data = JSON.stringify({
    eventId,
    timestamp: Date.now(),
  });
  return await qr.toDataURL(data);
}

export function parseQRCodeData(data: string): { eventId: string; timestamp: number } | null {
  try {
    const parsed = JSON.parse(data);
    if (parsed.eventId && parsed.timestamp) {
      return { eventId: parsed.eventId, timestamp: parsed.timestamp };
    }
    return null;
  } catch {
    return null;
  }
}
