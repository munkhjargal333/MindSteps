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
    type: 'fear',
    label: 'Айдас',
    sub: 'Аюулгүй болгох',
    insightLabel: 'Айдасыг нэрлэх',
    icon: Shield,
    tier: 'free',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    ring: 'ring-indigo-200 dark:ring-indigo-800',
  },

  // ── PRO (4) ───────────────────────────────────────────────
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
    type: 'gratitude',
    label: 'Талархал',
    sub: 'Сайхныг олж харах',
    insightLabel: 'Гүн талархах',
    icon: Heart,
    tier: 'pro',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    ring: 'ring-rose-200 dark:ring-rose-800',
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
      q: 'Сүүлийн үед толгойноос чинь гарахгүй эргэлдээд, чамайг дотроос нь шахаад байгаа зүйл юу байна?',
      placeholder: 'хийж амжихгүй байгаа ажил, шийдэгдээгүй асуудал, хүлээлт нэмэгдэх тусам амсхийх завгүй болох...',
    },
    inner: {
      q: 'Тэр бодол орж ирэх үед чи өөрийгөө яаж зохицуулах гэж оролддог вэ?',
      placeholder: 'дахиад дахин шалгах, хэт их бодож төлөвлөх, өөр зүйлд сатаарах, юу ч хийж чадахгүй гацаанд орох...',
    },
    meaning: {
      q: 'Яг тэр мөчид чи дотроо юуг өөрчлөгдсөн байгаасай гэж хамгийн их хүсдэг вэ?',
      placeholder: 'цаг хугацаа зогсоосой, энэ ажил өөрөө бүтчихээсэй, хэн нэгэн ирээд надад туслаасай, энэ нөхцөл байдлаас шууд алга болчихмоор...',
    },
  },

  loneliness: {
    surface: {
      q: 'Сүүлийн үед ямар нэг зүйл дутуу юм шиг мэдрэмж төрсөн мөч байсан уу?',
      placeholder: 'ойлголцох хүн байхгүй санагдах, хүмүүсийн дунд байвч ганцаараа мэт мэдрэгдэх, хуваалцах зүйл дотроо үлдэх...',
    },
    inner: {
      q: 'Тэр мэдрэмж төрөх үед чи ихэвчлэн хүмүүс рүү ойртдог уу, эсвэл өөрөөсөө холдуулдаг уу?',
      placeholder: 'утсаа оролдох, хэн нэгэнд бичих гэж байгаад больчих, хүнээс зайлсхийх, өөрийгөө дотогшоо татах...',
    },
    meaning: {
      q: 'Яг үнэндээ чамд би ганцаараа биш гэж мэдрэгдэх тэр мөч ямар байдаг вэ?',
      placeholder: 'хэн нэгэн шүүмжлэлгүй сонсох, зүгээр л хамт байж өгөх, өөрийг чинь үнэхээр ойлгож байгаа мэт санагдах...',
    },
  },

  self_doubt: {
    surface: {
      q: 'Сүүлийн үед би үнэхээр зөв хийж байна уу? гэж өөртөө эргэлзсэн зүйл юу байна?',
      placeholder: 'шийдвэр гаргахдаа тээнэгэлзэх, буруу сонголт хийчих вий гэж айх, хийж чадах эсэхдээ итгэлгүй байх...',
    },
    inner: {
      q: 'Эргэлзээ төрөх үед чи өөртэйгөө яаж харьцдаг вэ?',
      placeholder: 'дахин дахин баталгаа хайх, шийдвэрээ хойшлуулах, хэт их мэдээлэл цуглуулах, эхлүүлэлгүй орхих...',
    },
    meaning: {
      q: 'Яг тэр үед чи дотроо ямар мэдрэмжийг хамгийн ихээр хүсдэг вэ?',
      placeholder: 'алдах эрхтэй мэт санагдах, “би хангалттай” гэсэн дотоод баталгаа, төгс биш байсан ч урагшлах итгэл...',
    },
  },

  fear: {
    surface: {
      q: 'Сүүлийн үед өөрийн эрхгүй орж ирээд, зүрхийг чинь агшаадаг бодол юу байна?',
      placeholder: 'ямар нэг зүйл буруу эргэх вий, хайртай хүнээ алдах вий, гэнэт бүх зүйл нурчих вий...',
    },
    inner: {
      q: 'Тэр айдас мэдрэгдэх үед чи ихэвчлэн яаж хариу үйлдэл үзүүлдэг вэ?',
      placeholder: 'хэт их бэлтгэх, бүхнийг тооцоолох, бодохоос зайлсхийх, хэнд ч хэлэхгүй дотроо хадгалах...',
    },
    meaning: {
      q: 'Яг үнэндээ чи дотроо юуг хамгаалж үлдэхийг хамгийн их хүсэж байна вэ?',
      placeholder: 'өөртөө итгэх итгэл, хайртай хүмүүсээ алдахгүй байх, бүх зүйл нурсан ч давах чадвартай байх мэдрэмж...',
    },
  },

  purpose: {
    surface: {
      q: 'Сүүлийн үед юуг хийхдээ "яагаад энэ чухал юм бол" гэж гэнэт асуух мэт санагдсан уу?',
      placeholder: 'өдөр тутмын ажил, хичээл, харилцаа, хойшлуулаад байгаа зорилго...',
    },
    inner: {
      q: 'Тэр хоосон мэдрэмж орж ирэх үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'завгүй болох, шинэ зүйл хайх, гадаргуур хүнтэй байх, хэт их унтах...',
    },
    meaning: {
      q: 'Яг үнэндээ ямар мөчид "чухал юм хийж байна" гэсэн мэдрэмж чамд үнэхээр төрдөг вэ?',
      placeholder: 'хэн нэгэнд нөлөөлөх, өөрийгөө давах, үнэхээр сонирхдог зүйлээ хийх, хүн хүлээж байх...',
    },
  },

  gratitude: {
    surface: {
      q: 'Өнөөдөр жижиг ч гэсэн "за, энэ сайхан байна" гэж дотроо чимэглэсэн мөч байсан уу?',
      placeholder: 'дулааны мэдрэмж, бүтсэн ажил, хэн нэгний үг, тайван агшин...',
    },
    inner: {
      q: 'Тэр сайхан мэдрэмж орж ирэх үед чи үүнийгээ ихэвчлэн хэрхэн хүлээж авдаг вэ?',
      placeholder: 'дотроо тэмдэглэх, хэн нэгэнд хэлэх, үргэлжлүүлэхийг хүсэх, хурдан мартах...',
    },
    meaning: {
      q: 'Энэ мөч чамд амьдралдаа аль хэдийнэ байгаа ямар үнэт зүйлийг сануулж байна вэ?',
      placeholder: 'хангалттай байгаагаа, хайрлагдаж байгаагаа, нэг өдрийг бүтээж чадсанаа...',
    },
  },

  values: {
    surface: {
      q: 'Сүүлийн үед "энэ зөв биш" гэж дотроо хурцаар мэдэрсэн нөхцөл байдал байсан уу?',
      placeholder: 'хэн нэгний үйлдэл, өөрийн шийдвэр, хэлэгдээгүй үг, тэвчихэд хэцүү нөхцөл...',
    },
    inner: {
      q: 'Тэр мэдрэмж төрөх үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'засах гэж оролдох, хэлэхгүй тэвчих, зайлсхийх, дотроо буцалгах...',
    },
    meaning: {
      q: 'Яг үнэндээ тэрхүү зөрчлийн цаана чи юу үнэнч, зөв байгаасай гэж хүсэж байгаа юм бэ?',
      placeholder: 'шударга байдал, үгээ үйлдэлтэй нийцүүлэх, харилцааны ил тод байдал...',
    },
  },

  joy: {
    surface: {
      q: 'Сүүлийн үед чамайг гэнэт дотроос нь дүүргэж, нүүрэнд нь инээмсэглэл авчирсан зүйл байсан уу?',
      placeholder: 'санаанаас гадуур агшин, хүний үг, хамт байхын тухай мэдрэмж...',
    },
    inner: {
      q: 'Тэр баяр орж ирэх үед чи ихэвчлэн юу хийдэг вэ?',
      placeholder: 'хэн нэгэнтэй хуваалцах, дотроо хадгалах, үргэлжлүүлэхийг хүсэх, санаанаас арчих...',
    },
    meaning: {
      q: 'Яг үнэндээ тэр агшин чамд амьдралд чинь ямар зүйл үнэ цэнэтэй байгааг сануулж байна вэ?',
      placeholder: 'чөлөөтэй байх, хайртай хүмүүстэйгээ байх, өчүүхэн зүйлд анхаарах, өөрийгөө байх...',
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
    sub: '🫂 Чи дангаараа биш',
    dot: 'bg-blue-400',
    bg: 'bg-blue-50/60 dark:bg-blue-950/15',
  },
  {
    key: 'reframe' as const,
    label: 'Reframe',
    sub: '🌀 Өөр өнцгөөс харвал',
    dot: 'bg-violet-400',
    bg: 'bg-violet-50/60 dark:bg-violet-950/15',
  },
  {
    key: 'relief'  as const,
    label: 'Relief',
    sub: '🌱 Дотоод хүч чинь байсаар',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/15',
  },
] as const;