// 'use client';

// import { useAuth } from '@/context/AuthContext';
// import { useStats } from '@/lib/hooks/userStat';
// import { useGamification } from '@/lib/hooks/useGamification';
// import { useAutoTour } from '@/lib/hooks/useAutoTour';
// import { 
//   BookOpen, Activity, Flame, TrendingUp, Target, Sparkles, 
//   PenLine, Heart, Mountain, Brain, Eye, Zap, ArrowRight,
//   Award, Trophy, Star, ChevronRight
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// export default function DashboardPage() {
//   const { user } = useAuth();
//   useAutoTour('dashboard');

//   const { dashboard, loading: statsLoading, error: statsError } = useStats(user?.id);
//   const { gamification, loading: gamiLoading } = useGamification(user?.id);

//   const isLoading = statsLoading || gamiLoading;

//   if (isLoading) return <LoadingSkeleton />;
//   if (statsError) return <ErrorState />;
//   if (!dashboard || !gamification) return <EmptyState />;

//   return (
//     <div className="min-h-screen bg-background p-4 md:p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
        
//         {/* Hero Section - Gamification */}
//         <div data-tour="gamification-hero" className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-1">
//               <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
//                 {user?.user_metadata.full_name || user?.email || 'Сайн байна уу!'}
//               </h1>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border bg-card">
//                   <span className="text-xl leading-none">{gamification?.level?.icon || "🌱"}</span>
//                   <span className="font-semibold text-xs">
//                     {gamification?.level?.level_name || 'Эхлэгч'}
//                   </span>
//                 </div>
//                 <span className="text-xs">
//                   Түвшин {gamification?.level?.level_number || 1}
//                 </span>
//               </div>
//             </div>

//             {/* Streak */}
//             <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg border bg-card">
//               <Flame className="w-5 h-5 text-orange-500" />
//               <span className="text-sm font-bold">{gamification?.current_streak || 0}</span>
//               <span className="text-xs text-muted-foreground">өдөр</span>
//             </div>
//           </div>

//           {/* Progress Card */}
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex justify-between items-end mb-3">
//                 <div className="space-y-1">
//                   <p className="text-xs text-muted-foreground uppercase tracking-wider">
//                     Ухамсарлал
//                   </p>
//                   <p className="text-2xl font-bold">
//                     {gamification?.total_score?.toLocaleString() || 0} оноо
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-semibold">
//                     {gamification?.level_progress || 0}%
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Дараагийн түвшин
//                   </p>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-primary rounded-full transition-all duration-1000"
//                   style={{ width: `${gamification?.level_progress || 0}%` }}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-lg font-bold">Quick Actions</h2>
//               <p className="text-xs text-muted-foreground">Beginner → Advanced • Өнгөц танилцуулалт</p>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-3 md:gap-4">
//             <QuickActionCard
//               href="/quick-actions?type=thought"
//               icon={PenLine}
//               title="Бодол"
//               description="Тэмдэглэл"
//               color="blue"
//             />
//             <QuickActionCard
//               href="/quick-actions?type=emotion"
//               icon={Heart}
//               title="Мэдрэмж"
//               description="Сэтгэл хөдлөл v1"
//               color="rose"
//             />
//           </div>
//         </div>

//         {/* Medium Actions */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-lg font-bold">Medium Actions</h2>
//               <p className="text-xs text-muted-foreground">Medium → Advanced • Тодорхойлолт илчлэлт</p>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
//             <ActionCard
//               icon={Heart}
//               title="Сэтгэл хөдлөл v2"
//               badge="Medium"
//               disabled
//             />
//             <ActionCard
//               icon={Mountain}
//               title="Үнэт зүйл"
//               badge="Medium"
//               disabled
//             />
//             <ActionCard
//               icon={Target}
//               title="Зорилго"
//               badge="Coming"
//               disabled
//             />
//           </div>
//         </div>

//         {/* Advanced Actions */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-lg font-bold">Advanced Actions</h2>
//               <p className="text-xs text-muted-foreground">Advanced → Descend • Хөгжил үйлдэл</p>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
//             <ActionCard
//               icon={Zap}
//               title="Үйлдэхүй"
//               badge="Advanced"
//               disabled
//             />
//             <ActionCard
//               icon={Brain}
//               title="Удирдахуй"
//               badge="Advanced"
//               disabled
//             />
//             <ActionCard
//               icon={Eye}
//               title="Засахуй"
//               badge="Advanced"
//               disabled
//             />
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
//           {/* Activity Card */}
//           <Card data-tour="activity-card">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
//                   Миний идэвх
//                 </CardTitle>
//                 <TrendingUp className="w-4 h-4 text-primary" />
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
              
//               {/* Journals */}
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                   <BookOpen className="w-5 h-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">
//                     {dashboard?.stats.total_journals || 0}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Тэмдэглэл</p>
//                 </div>
//               </div>

//               <div className="h-px bg-border" />

//               {/* Moods */}
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                   <Activity className="w-5 h-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">
//                     {dashboard?.stats.total_moods || 0}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Сэтгэл санаа</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Learning Progress */}
//           <Card data-tour="progress-card" className="md:col-span-2">
//             <CardHeader>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                   <BookOpen className="w-5 h-5 text-primary" />
//                 </div>
//                 <div>
//                   <CardTitle>Мэдлэгийн явц</CardTitle>
//                   <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
//                     <TrendingUp className="w-3 h-3 text-primary" />
//                     {dashboard?.stats.total_lessons_completed} хичээл дуусгасан
//                   </p>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {dashboard?.category_progress.map(cat => (
//                   <div key={cat.category_id} className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <span className="text-lg leading-none">{cat.emoji}</span>
//                         <span className="text-sm font-semibold">
//                           {cat.category_name}
//                         </span>
//                       </div>
//                       <span className="text-xs font-semibold text-primary">
//                         {Math.round(cat.progress_percent)}%
//                       </span>
//                     </div>
//                     <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
//                       <div 
//                         className="h-full bg-primary rounded-full transition-all duration-1000"
//                         style={{ width: `${cat.progress_percent}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Plutchik Wheel Placeholder */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Сэтгэл хөдлөлийн дүрслэл</CardTitle>
//             <CardDescription>
//               Plutchik Wheel • Сүүлийн 30 хоног
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
//               <div className="text-center space-y-2">
//                 <Activity className="w-12 h-12 text-muted-foreground mx-auto" />
//                 <p className="text-sm text-muted-foreground">
//                   Plutchik Wheel тун удахгүй...
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Reflection System Placeholder */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Толин тусгал</CardTitle>
//             <CardDescription>
//               Системийн дүгнэлт • Үнэт зүйл, Энергийн урсгал
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="p-4 border rounded-lg">
//                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
//                   <Target className="w-5 h-5 text-primary" />
//                 </div>
//                 <h4 className="font-semibold mb-1">Үнэт зүйл</h4>
//                 <p className="text-xs text-muted-foreground">Таны үнэлэмж хандлага</p>
//               </div>
//               <div className="p-4 border rounded-lg">
//                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
//                   <Zap className="w-5 h-5 text-primary" />
//                 </div>
//                 <h4 className="font-semibold mb-1">Энергийн урсгал</h4>
//                 <p className="text-xs text-muted-foreground">Таны чиглэл хөдөлгөөн</p>
//               </div>
//               <div className="p-4 border rounded-lg">
//                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
//                   <Award className="w-5 h-5 text-primary" />
//                 </div>
//                 <h4 className="font-semibold mb-1">Биелэлт</h4>
//                 <p className="text-xs text-muted-foreground">Таны амжилт ахиц</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//       </div>
//     </div>
//   );
// }

// // Quick Action Card Component
// function QuickActionCard({ 
//   href, 
//   icon: Icon, 
//   title, 
//   description, 
//   color 
// }: {
//   href: string;
//   icon: any;
//   title: string;
//   description: string;
//   color: string;
// }) {
//   const colors: any = {
//     blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 hover:border-blue-300',
//     rose: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 hover:border-rose-300',
//   };

//   return (
//     <Link href={href}>
//       <Card className={`transition-all hover:shadow-md ${colors[color]}`}>
//         <CardContent className="p-4">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
//               <Icon className="w-5 h-5" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h3 className="font-semibold text-sm">{title}</h3>
//               <p className="text-xs text-muted-foreground truncate">{description}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }

// // Action Card Component
// function ActionCard({ 
//   icon: Icon, 
//   title, 
//   badge, 
//   disabled = false 
// }: {
//   icon: any;
//   title: string;
//   badge: string;
//   disabled?: boolean;
// }) {
//   return (
//     <Card className={disabled ? 'opacity-50' : 'cursor-pointer hover:shadow-md transition-all'}>
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between mb-2">
//           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
//             <Icon className="w-4 h-4 text-primary" />
//           </div>
//           <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted">
//             {badge}
//           </span>
//         </div>
//         <h3 className="font-semibold text-sm">{title}</h3>
//       </CardContent>
//     </Card>
//   );
// }

// // Loading Skeleton
// function LoadingSkeleton() {
//   return (
//     <div className="min-h-screen bg-background p-4 md:p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div className="space-y-4">
//           <div className="h-20 bg-muted rounded-lg animate-pulse" />
//           <div className="h-24 bg-muted rounded-lg animate-pulse" />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="h-24 bg-muted rounded-lg animate-pulse" />
//           <div className="h-24 bg-muted rounded-lg animate-pulse" />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//           <div className="h-48 bg-muted rounded-lg animate-pulse" />
//           <div className="h-48 bg-muted rounded-lg animate-pulse md:col-span-2" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Error State
// function ErrorState() {
//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <Card className="max-w-md w-full">
//         <CardContent className="pt-6 text-center space-y-4">
//           <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
//             <Activity className="w-6 h-6 text-destructive" />
//           </div>
//           <div>
//             <h3 className="font-semibold mb-1">Алдаа гарлаа</h3>
//             <p className="text-sm text-muted-foreground">
//               Өгөгдөл ачаалахад алдаа гарлаа. Дахин оролдоно уу.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // Empty State
// function EmptyState() {
//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <Card className="max-w-md w-full">
//         <CardContent className="pt-6 text-center space-y-4">
//           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
//             <Target className="w-6 h-6 text-muted-foreground" />
//           </div>
//           <div>
//             <h3 className="font-semibold mb-1">Өгөгдөл олдсонгүй</h3>
//             <p className="text-sm text-muted-foreground">
//               Таны статистик мэдээлэл хараахан бэлэн болоогүй байна.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }