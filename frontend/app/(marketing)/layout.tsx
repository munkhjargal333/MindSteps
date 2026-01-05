import "../globals.css"; // CSS-ээ энд дуудах шаардлагатай

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <section className="marketing-wrapper">
          {children}
        </section>
      </body>
    </html>
  );
}