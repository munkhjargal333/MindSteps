import {
  Zap, Users, Heart, HelpCircle,
  Target, Compass, Shield, Sun,
  Layers, Flame, LucideIcon,
} from 'lucide-react';
import type { QuickActionType } from '../types/types';

// ─── Tier ─────────────────────────────────────────────────────

export type Tier = 'free' | 'pro';

// ─── Action catalog ───────────────────────────────────────────

export interface ActionConfig {
  type: QuickActionType;
  label: string;
  sub: string;
  icon: LucideIcon;
  tier: Tier;
  color: string;
  bg: string;
  ring: string;
  // Seed Insight label
  insightLabel?: string;
}

export const ALL_ACTIONS: ActionConfig[] = [
  // ── FREE (4) ──────────────────────────────────────────────
  {
    type: 'gratitude',
    label: 'Талархал',
    sub: 'Сайхныг олж харах',
    insightLabel: 'Гүн талархах',
    icon: Heart,
    tier: 'free',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    ring: 'ring-rose-200 dark:ring-rose-800',
  },
  {
    type: 'stress',
    label: 'Стресс',
    sub: 'Түгшүүрээ багасгах',
    insightLabel: 'Юу дарамт үүсгээд байгааг харах',
    icon: Zap,
    tier: 'free',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    ring: 'ring-orange-200 dark:ring-orange-800',
  },
  {
    type: 'self_doubt',
    label: 'Өөртөө эргэлзэх',
    sub: 'Өөрийгөө ойлгох',
    insightLabel: 'Чамд юу саад болж байгааг таних',
    icon: HelpCircle,
    tier: 'free',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    ring: 'ring-amber-200 dark:ring-amber-800',
  },
  {
    type: 'loneliness',
    label: 'Ганцаардал',
    sub: 'Дотроо ярих',
    insightLabel: 'Яг юуг үгүйлээд байгааг мэдэх',
    icon: Users,
    tier: 'free',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    ring: 'ring-sky-200 dark:ring-sky-800',
  },


  // ── PRO (4+, нэмэгдэх боломжтой) ─────────────────────────
  {
    type: 'purpose',
    label: 'Зорилго олох',
    sub: 'Чиглэлээ тодорхойлох',
    insightLabel: 'Утга учир харах',
    icon: Target,
    tier: 'pro',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    ring: 'ring-violet-200 dark:ring-violet-800',
  },
  {
    type: 'values',
    label: 'Үнэт зүйл',
    sub: 'Юу чухалыг мэдэх',
    insightLabel: 'Үнэт зүйл тунгаах',
    icon: Compass,
    tier: 'pro',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/20',
    ring: 'ring-teal-200 dark:ring-teal-800',
  },
  {
    type: 'fear',
    label: 'Айдас',
    sub: 'Аюулгүй болгох',
    insightLabel: 'Айдасыг нэрлэх',
    icon: Shield,
    tier: 'pro',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    ring: 'ring-indigo-200 dark:ring-indigo-800',
  },
  {
    type: 'joy',
    label: 'Баяр',
    sub: 'Агшинг тэмдэглэх',
    insightLabel: 'Баяр гүнзгийрүүлэх',
    icon: Sun,
    tier: 'pro',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    ring: 'ring-yellow-200 dark:ring-yellow-800',
  },
];

export const FREE_ACTIONS  = ALL_ACTIONS.filter((a) => a.tier === 'free');
export const PRO_ACTIONS   = ALL_ACTIONS.filter((a) => a.tier === 'pro');

export const ACTION_MAP = Object.fromEntries(
  ALL_ACTIONS.map((a) => [a.type, a]),
) as Record<string, ActionConfig>;

// ─── Step indicator metadata ──────────────────────────────────

export const STEPS: { label: string; icon: LucideIcon }[] = [
  { label: 'Гадаргуу', icon: Layers },
  { label: 'Дотоод',   icon: Flame  },
  { label: 'Утга',     icon: Compass },
];

// ─── Per-action question copy ─────────────────────────────────

export interface StepCopy {
  surface: { q: string; placeholder: string };
  inner:   { q: string; placeholder: string };
  meaning: { q: string; placeholder: string };
}

export const STEP_CONFIG: Record<string, StepCopy> = {
  stress: {
    surface: {
      q: 'Сүүлийн үед толгойноос чинь салахаа байгаад байгаа жижиг зүйл юу байна?',
      placeholder: 'хийх ёстой, амжихгүй, бодогдоод байгаа...',
    },
    inner: {
      q: 'Тэр үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'зайлсхийх, бодох, шалгах, тайлбарлах...',
    },
    meaning: {
      q: 'Чи дотроо яг юу хэвийн болоосой гэж хүсээд байгаа юм шиг санагддаг вэ?',
      placeholder: 'тайван, тодорхой, амжих боломжтой...',
    },
  },
  loneliness: {
    surface: {
      q: 'Сүүлийн үед дутуу санагдаж байгаа зүйл?',
      placeholder: 'хүн, яриа, ойлголт, орон зай...',
    },
    inner: {
      q: 'Тэр үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'залгах, зайлсхийх, бодох, цэгцлэх...',
    },
    meaning: {
      q: 'Хэн нэгэн яг ойлгосон мэт санагддаг мөч гэж чамд юу вэ?',
      placeholder: 'сонсох, хамт суух, ойлгох...',
    },
  },
  gratitude: {
    surface: {
      q: 'Өнөөдөр юу сайхан байсан бэ?',
      placeholder: 'Жижиг ч байсан зүйлийг хүлээн авч болно...',
    },
    inner: {
      q: 'Тэр сайхан зүйл тохиолдоход чи анхнаас юу хийсэн бэ?',
      placeholder: 'инээмсэглэсэн, догдлосон, тэврэсэн...',
    },
    meaning: {
      q: 'Энэ мэдрэмж чамд юу хангалттай байгааг сануулж байна?',
      placeholder: 'тайван, дулаахан, баталгаатай...',
    },
  },
  self_doubt: {
    surface: {
      q: 'Сүүлийн үед тээнэгэлзүүлж байгаа зүйл?',
      placeholder: 'хийх үү, хойшлуулах уу, чадах болов уу...',
    },
    inner: {
      q: 'Тэр үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'гадагш лавлах, баталгаа хайх, ухрах...',
    },
    meaning: {
      q: 'Чи яг юу баталгаатай болоосой гэж хүсээд байгаа юм шиг санагддаг вэ?',
      placeholder: 'бусдын бодол, боломж, өөрийн үнэлэмж...',
    },
  },

  purpose: {
    surface: {
      q: 'Сүүлийн үед юуг учиргүй гэж мэдэрч байна?',
      placeholder: 'ажил, өдөр, зүтгэл...',
    },
    inner: {
      q: 'Тэр үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'завгүй болох, гадагш хайх, хэт бодох...',
    },
    meaning: {
      q: 'Чамд яг ямар амьдрал утга учиртай санагдаж байгаа юм шиг байна вэ?',
      placeholder: 'үр дүн, хувь нэмэр, өсөлт...',
    },
  },
  values: {
    surface: {
      q: 'Сүүлд ямар зүйл буруу мэт санагдаж байсан бэ?',
      placeholder: 'хүний үйлдэл, нөхцөл байдал, шийдвэр...',
    },
    inner: {
      q: 'Тэр үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'засах, тайлбарлах, зайлсхийх, хэлэх...',
    },
    meaning: {
      q: 'Чамд яг юу зөв байгаасай гэж хүсээд байгаа юм шиг санагддаг вэ?',
      placeholder: 'үнэнч байдал, шударга байдал, хайр...',
    },
  },
  fear: {
    surface: {
      q: 'Сүүлийн үед толгой эргүүлээд байгаа зүйл юу байна?',
      placeholder: 'ирээдүй, алдах, буруутгах...',
    },
    inner: {
      q: 'Тэр үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'бэлтгэх, тооцох, зайлсхийх, хяналт...',
    },
    meaning: {
      q: 'Чи яг юу аюулгүй байгаасай гэж хүсээд байгаа юм шиг санагддаг вэ?',
      placeholder: 'өөрийгөө, хүмүүсээ, ирээдүйгээ...',
    },
  },
  joy: {
    surface: {
      q: 'Сүүлд юу чамайг гэнэт баярлуулсан бэ?',
      placeholder: 'агшин, хүн, харах, мэдрэх...',
    },
    inner: {
      q: 'Тэр мөчид чи юу хийсэн бэ?',
      placeholder: 'инээсэн, тэврэсэн, гайхсан, зогссон...',
    },
    meaning: {
      q: 'Энэ баяр чамд амьдралын яг ямар талыг сануулж байна?',
      placeholder: 'үнэ цэнэ, холбоо, өөрөө байх...',
    },
  },
};

export const ACTION_LABELS: Record<string, string> = {
  stress: 'стресс', loneliness: 'ганцаардал', gratitude: 'талархал',
  self_doubt: 'өөртөө эргэлзэх', purpose: 'зорилго олох',
  values: 'үнэт зүйл', fear: 'айдас', joy: 'баяр',
};

// ─── Seed Insight cards ───────────────────────────────────────

export const INSIGHT_CARDS = [
  {
    key: 'mirror'  as const,
    label: 'Mirror',
    sub: 'Чиний хэлснийг тусгавал',
    dot: 'bg-blue-400',
    bg: 'bg-blue-50/60 dark:bg-blue-950/15',
  },
  {
    key: 'reframe' as const,
    label: 'Reframe',
    sub: 'Өнцгийг эргүүлэвэл',
    dot: 'bg-violet-400',
    bg: 'bg-violet-50/60 dark:bg-violet-950/15',
  },
  {
    key: 'relief'  as const,
    label: 'Relief',
    sub: 'Ачааг хөнгөлөвөл',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/15',
  },
] as const;