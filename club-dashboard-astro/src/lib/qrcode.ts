import qr from 'qrcode';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(import.meta.env.AUTH_SECRET);

/**
 * Generate a signed QR code data URL for an event.
 * Token expires in 4 hours.
 */
export async function generateEventQR(eventId: string, siteUrl: string): Promise<string> {
  const token = await new SignJWT({ event_id: eventId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('4h')
    .setIssuedAt()
    .sign(secret);

  const url = `${siteUrl}/checkin?token=${token}`;
  return await qr.toDataURL(url);
}

/**
 * Verify and decode a QR check-in token.
 * Returns the event_id or null if invalid/expired.
 */
export async function verifyQRToken(token: string): Promise<{ event_id: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { event_id: payload['event_id'] as string };
  } catch {
    return null;
  }
}
