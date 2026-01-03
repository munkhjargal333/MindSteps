// app/(marketing)/layout.tsx
import '@/app/globals.css'; // Гадна байгаа globals.css рүү заах зам

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="marketing-wrapper">
      {children}
    </section>
  );
}