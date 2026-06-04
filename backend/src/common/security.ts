import { createHash } from 'crypto';

export function hashPassword(password: string): string {
  return createHash('sha256').update(`travel-booking:${password}`).digest('hex');
}

export function createSessionToken(userId: number, role: string): string {
  return Buffer.from(`${userId}:${role}:${Date.now()}`).toString('base64url');
}

export function parseSessionToken(token: string): { userId: number; role: string } | null {
  try {
    const [id, role] = Buffer.from(token, 'base64url').toString('utf8').split(':');
    const userId = Number(id);
    return Number.isFinite(userId) ? { userId, role } : null;
  } catch {
    return null;
  }
}
