export const TIERS = ['free', 'pro', 'premium', 'admin'] as const;
export type Tier = (typeof TIERS)[number];

export const PERMISSIONS = {
  view_insights: ['pro', 'premium', 'admin'],
  view_emotions: ['pro', 'premium', 'admin'],
  view_graph:    ['pro', 'premium', 'admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function can(tier: Tier, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(tier);
}

export const TIER_LABEL: Record<string, string> = {
  pro:     'PRO',
  premium: 'PRE',
};