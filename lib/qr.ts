import crypto from 'crypto';
import QRCode from 'qrcode';

// It is crucial to have this secret defined in .env
const QR_SECRET = process.env.QR_HMAC_SECRET || 'fallback_secret_only_for_dev';

/**
 * Generates a cryptographically signed QR token.
 * Format: {ticketId}.{nonce}.{hmac_sha256_signature}
 */
export function generateQrToken(ticketId: string): string {
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${ticketId}.${nonce}`;
  const signature = crypto
    .createHmac('sha256', QR_SECRET)
    .update(payload)
    .digest('hex');
  return `${payload}.${signature}`;
}

/**
 * Verifies a QR token and extracts the ticket ID.
 * Returns valid: false if tampered or improperly formatted.
 */
export function verifyQrToken(token: string): { valid: boolean; ticketId: string | null } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, ticketId: null };
    
    const [ticketId, nonce, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', QR_SECRET)
      .update(`${ticketId}.${nonce}`)
      .digest('hex');
      
    const valid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );
    
    return { valid, ticketId: valid ? ticketId : null };
  } catch (error) {
    return { valid: false, ticketId: null };
  }
}

/**
 * Renders the QR token as a PNG Buffer (useful for email attachments).
 */
export async function renderQrImage(token: string): Promise<Buffer> {
  return QRCode.toBuffer(token, { 
    width: 400, 
    margin: 2,
    errorCorrectionLevel: 'H'
  });
}

/**
 * Renders the QR token as a Base64 Data URL (useful for inline HTML rendering).
 */
export async function renderQrDataUrl(token: string): Promise<string> {
  return QRCode.toDataURL(token, { 
    width: 400, 
    margin: 2, 
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#ffffff' } 
  });
}
