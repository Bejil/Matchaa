export const PASSWORD_SIGNUP_MIN_LENGTH = 12

export type PasswordSignupChecks = {
  minLength: boolean
  upper: boolean
  lower: boolean
  digit: boolean
  special: boolean
}

const ASCII_SPECIAL_RE = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/

function hasSpecialChar(password: string): boolean {
  try {
    return /[^\p{L}\p{N}\s]/u.test(password)
  } catch {
    return ASCII_SPECIAL_RE.test(password)
  }
}

export function getPasswordSignupChecks(password: string): PasswordSignupChecks {
  return {
    minLength: password.length >= PASSWORD_SIGNUP_MIN_LENGTH,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: hasSpecialChar(password),
  }
}

export function passwordMeetsSignupPolicy(password: string): boolean {
  const c = getPasswordSignupChecks(password)
  return c.minLength && c.upper && c.lower && c.digit && c.special
}
