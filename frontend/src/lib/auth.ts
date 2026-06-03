import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'california-special-needs-navigator-super-secret-key-2026';
const SALT_ROUNDS = 10000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

// ----------------------------------------------------
// Password Hashing (PBKDF2)
// ----------------------------------------------------

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, KEY_LEN, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const verifyHash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, KEY_LEN, DIGEST).toString('hex');
  return hash === verifyHash;
}

// ----------------------------------------------------
// Stateless HMAC-SHA256 JWT Implementation
// ----------------------------------------------------

export interface UserSession {
  userId: string;
  email: string;
  exp: number;
}

export function signToken(payload: Omit<UserSession, 'exp'>, expiresInDays = 7): string {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64url');
    
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): UserSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${body}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as UserSession;
    
    // Check expiration date
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}
