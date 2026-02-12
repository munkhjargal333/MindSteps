import { QuickActionContainer } from '@/components/QuickActionContainer';
import { MainHeader } from '@/components/shared/MainHeader';

export default function App() {
  return (
    // Fragment (<>...</>) эсвэл div ашиглана
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />
      
      {/* Main контент хэсэг */}
      <main className="flex-1 flex flex-col items-center">
        {/* QuickActionContainer дотор байгаа Container эсвэл Card-нууд энд гарна */}
        <QuickActionContainer />
      </main>
    </div>
  );
}