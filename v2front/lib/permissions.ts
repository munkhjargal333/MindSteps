export const TIERS = ['free', 'demo', 'pro'] as const;
export type Tier = (typeof TIERS)[number];

export const PERMISSIONS = {
  view_insights: ["free",'pro'],
  view_emotions: ["free",'pro'],
  view_graph:    ["free",'pro'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function can(tier: Tier, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(tier);
}

export const TIER_LABEL: Record<string, string> = {
  pro:     'PRO',
  premium: 'PRE',
};