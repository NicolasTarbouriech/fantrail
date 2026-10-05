const INVITE_CODE_PATTERN = /^[A-HJ-NP-Z2-9]{8}$/;

export function normalizeInviteCode(value: string): string {
  return value.replace(/\s/g, '').toUpperCase();
}

export function isInviteCode(value: string): boolean {
  return INVITE_CODE_PATTERN.test(normalizeInviteCode(value));
}

export function buildInviteLink(origin: string, inviteCode: string): string {
  return `${origin}/join/${inviteCode}`;
}
