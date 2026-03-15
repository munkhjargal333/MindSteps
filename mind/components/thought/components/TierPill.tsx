import type { Tier } from '../../../types/types';
import s from './TierPill.module.css';

interface Props { tier: Tier }

export function TierPill({ tier }: Props) {
  return (
    <span className={[s.pill, tier === 'free' ? s.free : s.pro].join(' ')}>
      <span className={s.dot}>{tier === 'free' ? '🟢' : '🟣'}</span>
      {tier === 'free' ? 'Үнэгүй' : 'Pro'}
    </span>
  );
}
