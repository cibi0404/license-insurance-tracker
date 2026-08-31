// Shared design tokens for the compliance-tool aesthetic used across
// Dashboard, Welcome, and anywhere else that needs to match: deep ink text,
// one indigo/teal accent pair, and desaturated (not neon) status colors.
export const INK = '#12162A';
export const MUTED = '#64748B';
export const LICENSE_COLOR = '#3949AB';
export const POLICY_COLOR = '#00897B';

export const STATUS_LABELS = {
  active: 'Active',
  'expiring-soon': 'Expiring soon',
  expired: 'Expired',
  'pending-verification': 'Pending verification',
};

export const STATUS_COLORS = {
  active: '#0F7A5C',
  'expiring-soon': '#B5820A',
  expired: '#B3261E',
  'pending-verification': '#5B6472',
};

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}