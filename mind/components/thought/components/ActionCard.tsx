import { ChevronRight, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import s from './ActionCard.module.css';

interface Props {
  label: string;
  sub: string;
  icon: LucideIcon;
  /** icon / label color e.g. "#ea580c" */
  color: string;
  /** icon background color e.g. "#fff7ed" */
  iconBg: string;
  /** card background color */
  cardBg: string;
  locked?: boolean;
  onClick?: () => void;
}

export function ActionCard({
  label, sub, icon: Icon,
  color, iconBg, cardBg,
  locked = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      className={[s.card, locked ? s.locked : ''].join(' ')}
      style={{ background: locked ? undefined : cardBg }}
    >
      <span className={s.iconWrap} style={{ background: iconBg, color }}>
        <Icon size={18} />
      </span>

      <span className={s.body}>
        <span className={s.label} style={{ color: locked ? undefined : color }}>
          {label}
        </span>
        <span className={s.sub}>{sub}</span>
      </span>

      {locked
        ? <Lock size={13} className={s.arrow} />
        : <ChevronRight size={14} className={s.arrow} />}
    </button>
  );
}
