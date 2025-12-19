/**
 * Input Sanitization
 * 
 * Funções básicas de sanitização para prevenir XSS e injection attacks.
 * LGPD + segurança básica.
 */

/**
 * Remove tags HTML potencialmente perigosas de uma string
 * Sanitização mínima defensiva
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitiza input de texto removendo caracteres de controle
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  // Remove caracteres de controle exceto newline e tab
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Valida e sanitiza email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  const trimmed = email.trim().toLowerCase();
  // Remove caracteres não permitidos em emails
  return trimmed.replace(/[^a-z0-9@._+-]/gi, '');
}

/**
 * Sanitiza URL removendo javascript: e data: schemes
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Bloqueia esquemas perigosos
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }
  
  return url.trim();
}
