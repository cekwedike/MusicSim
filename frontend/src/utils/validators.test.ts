import { describe, it, expect } from 'vitest';
import { isValidEmail, isStrongPassword } from './validators';

describe('validators', () => {
  it('validates email formats', () => {
    const valid = ['user@example.com', 'first.last@domain.co', 'x@y.zw'];
    const validWithWhitespace = ['  user@example.com  ', '\tfirst.last@domain.co\n'];
    const invalid = ['no-at.com', 'bad@', '@nodomain.com', 'a@b'];
    valid.forEach(e => expect(isValidEmail(e)).toBe(true));
    validWithWhitespace.forEach(e => expect(isValidEmail(e)).toBe(true));
    invalid.forEach(e => expect(isValidEmail(e)).toBe(false));
  });

  it('validates password strength', () => {
    const good = ['Str0ng!Pass', 'XyZ123!!', 'Abcdef1@'];
    const bad = ['short1!', 'NoDigits!', 'noupper1!', 'NOLOWER1!', 'NoSymbols1'];
    good.forEach(p => expect(isStrongPassword(p)).toBe(true));
    bad.forEach(p => expect(isStrongPassword(p)).toBe(false));
  });
});
