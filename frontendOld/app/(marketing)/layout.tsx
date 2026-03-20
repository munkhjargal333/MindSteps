// app/(marketing)/layout.tsx
// globals.css-ийг Root-д дуудсан байгаа тул энд дахин дуудах шаардлагагүй
// хэрэв тусгай маркетинг CSS байгаа бол түүнийгээ л үлдээ.

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    // html, body-г бүрэн устгаад зөвхөн хэрэгцээт section-оо үлдээ
    <section className="marketing-wrapper min-h-screen">
      {children}
    </section>
  );
}