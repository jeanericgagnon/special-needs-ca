import crypto from 'crypto';

function getSecretKey(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is not defined. Failing closed.');
  }
  return secret;
}

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

export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const verifyHash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, KEY_LEN, DIGEST).toString('hex');
  return timingSafeCompare(hash, verifyHash);
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
    .createHmac('sha256', getSecretKey())
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
      .createHmac('sha256', getSecretKey())
      .update(`${header}.${body}`)
      .digest('base64url');
      
    if (!timingSafeCompare(signature, expectedSignature)) return null;
    
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

