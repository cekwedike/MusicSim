export function isValidEmail(email: string): boolean {
  // Simple but effective email regex (no unicode domain handling)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

export function isStrongPassword(pw: string): boolean {
  if (typeof pw !== 'string') return false;
  if (pw.length < 8) return false;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  return hasUpper && hasLower && hasDigit && hasSymbol;
}
