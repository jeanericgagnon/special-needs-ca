/**
 * Simple text sanitization to strip HTML tags and prevent XSS
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  // Strip standard HTML tag syntax
  let clean = text.replace(/<[^>]*>/g, '');
  // Escape remaining special characters
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  return clean;
}

/**
 * Basic obfuscation to protect sensitive medical descriptions in localStorage on shared devices
 */
export function encryptData(data: string): string {
  if (typeof window === 'undefined') return '';
  try {
    const key = 42; // XOR key
    const xorChars = data.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
    return btoa(unescape(encodeURIComponent(xorChars)));
  } catch (e) {
    console.error('Obfuscation failed:', e);
    return data;
  }
}

export function decryptData(obfuscatedData: string): string {
  if (typeof window === 'undefined') return '';
  try {
    const key = 42;
    const decoded = decodeURIComponent(escape(atob(obfuscatedData)));
    return decoded.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
  } catch {
    // Fallback in case the item was stored in plain text originally
    return obfuscatedData;
  }
}

/**
 * Safe LocalStorage getters/setters with obfuscation
 */
export const safeStorage = {
  getItem(key: string, defaultValue: string = ''): string {
    if (typeof window === 'undefined') return defaultValue;
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;
    return decryptData(value);
  },
  
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    const obfuscated = encryptData(value);
    localStorage.setItem(key, obfuscated);
  },
  
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};
