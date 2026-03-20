import { Maslow, CoreValue } from '@/lib/types';
import { motion } from 'framer-motion';

interface Props {
  levels: Maslow[];
  values: CoreValue[];
  filterLevel: number | null;
  onFilter: (id: number | null) => void;
}

export function MaslowPyramid({
  levels,
  values,
  filterLevel,
  onFilter,
}: Props) {
  const sortedLevels = [...levels].sort((a, b) => b.id - a.id);

  return (
    <div className="w-full max-w-sm mx-auto px-3 py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-base font-black text-gray-800">
          Маслоугийн пирамид
        </h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
          Хэрэгцээний шатлал
        </p>
      </div>

      {/* Pyramid */}
      <div className="relative flex flex-col items-center gap-2">
        {sortedLevels.map((level, idx) => {
          const isActive = filterLevel === level.id;
          const count = values.filter(
            v => v.maslow_level_id === level.id
          ).length;

          // Responsive width
          const widthMobile = 88 + idx * 10.5;
          const widthDesktop = 60 + idx * 8;

          return (
            <motion.button
              key={level.id}
              onClick={() => onFilter(isActive ? null : level.id)}
              whileTap={{ scale: 0.96 }}
              transition={{
                type: 'spring',
                stiffness: 520,
                damping: 26,
              }}
              className={`
                relative flex items-center justify-between
                rounded-xl px-4 py-3
                border backdrop-blur-md
                transition-all duration-300
                ${isActive ? 'scale-[1.04] shadow-2xl z-10' : 'opacity-90'}
              `}
              style={{
                width: `clamp(${widthMobile}%, ${widthDesktop}%, 100%)`,
                background: isActive
                  ? `linear-gradient(
                      135deg,
                      ${level.color} 0%,
                      rgba(255,255,255,0.18) 100%
                    )`
                  : `linear-gradient(
                      135deg,
                      ${level.color}cc 0%,
                      ${level.color} 100%
                    )`,
                borderColor: 'rgba(255,255,255,0.35)',
              }}
            >
              {/* Edge shine */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* Inner glow (active) */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    boxShadow:
                      'inset 0 0 22px rgba(255,255,255,0.4)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}

              {/* Content */}
              <div className="relative flex items-center gap-3 min-w-0">
                <span className="text-xl">{level.icon}</span>
                <span className="text-[12px] sm:text-sm font-black text-white truncate">
                  {level.name}
                </span>
              </div>

              {/* Count */}
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative bg-white/30 text-white text-[10px] px-2.5 py-1 rounded-md font-black border border-white/30"
                >
                  {count}
                </motion.span>
              )}

              {/* Active overlay */}
              {isActive && (
                <motion.div
                  layoutId="active-pyramid-glow"
                  className="absolute inset-0 rounded-xl bg-white/10 mix-blend-overlay pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {filterLevel ? (
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Шүүлтүүр идэвхтэй
            </span>
          </div>
        ) : (
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            Түвшин сонгоно уу
          </p>
        )}
      </motion.div>
    </div>
  );
}
