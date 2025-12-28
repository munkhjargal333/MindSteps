// app/terms/page.tsx
import React from 'react';

export const metadata = {
  title: 'Terms of Use',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Terms of Use</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="font-medium">1. Ерөнхий нөхцөл</h2>
          <p>
            Энэхүү платформыг ашигласнаар та эдгээр нөхцөлийг уншиж,
            ойлгож, зөвшөөрсөнд тооцогдоно.
          </p>
        </div>

        <div>
          <h2 className="font-medium">2. Үйлчилгээний зорилго</h2>
          <p>
            Манай систем нь сэтгэл хөдлөлийг ойлгомжтой болгох,
            дотоод төлөвийг дүрслэх, өөрийгөө ойлгох үйл явцыг дэмжихэд
            зориулагдсан.
          </p>
          <p className="mt-2">
            Энэхүү үйлчилгээ нь эмчилгээ, онош, мэргэжлийн зөвлөгөө биш.
          </p>
        </div>

        <div>
          <h2 className="font-medium">3. Эрүүл мэндийн анхааруулга</h2>
          <p>
            Платформоос гарч буй аливаа мэдээлэл нь эмнэлгийн
            болон сэтгэл заслын зөвлөгөө гэж ойлгогдох ёсгүй.
          </p>
          <p className="mt-2">
            Хэрэв та сэтгэл зүйн хүнд байдалд орсон гэж үзвэл
            мэргэжлийн байгууллагад хандана уу.
          </p>
        </div>

        <div>
          <h2 className="font-medium">4. Хэрэглэгчийн хариуцлага</h2>
          <p>
            Та системд оруулж буй мэдээлэлдээ өөрөө хариуцлага хүлээнэ.
            Манай систем нь шийдвэр гаргах хэрэгсэл биш бөгөөд
            үр дагаврыг хариуцахгүй.
          </p>
        </div>

        <div>
          <h2 className="font-medium">5. Мэдээллийн ашиглалт</h2>
          <p>
            Оруулсан өгөгдөл нь зөвхөн үйлчилгээний зорилгод
            ашиглагдана. Системийг сайжруулах зорилгоор
            нэргүй байдлаар ашиглагдаж болзошгүй.
          </p>
        </div>

        <div>
          <h2 className="font-medium">6. Оюуны өмч</h2>
          <p>
            Платформын бүтэц, логик, ойлголтын загварууд нь
            оюуны өмчид хамаарна.
          </p>
        </div>

        <div>
          <h2 className="font-medium">7. Үйлчилгээний өөрчлөлт</h2>
          <p>
            Бид үйлчилгээний агуулга, нөхцөлийг
            урьдчилан мэдэгдэхгүйгээр өөрчлөх эрхтэй.
          </p>
        </div>

        <div>
          <h2 className="font-medium">8. Хариуцлагын хязгаарлалт</h2>
          <p>
            Үйлчилгээ нь “байгаагаар нь” хэлбэрээр олгогдоно.
            Системийн тасалдал, өгөгдлийн алдагдалд
            бид хариуцлага хүлээхгүй.
          </p>
        </div>

        <div>
          <h2 className="font-medium">9. Холбоо барих</h2>
          <p>
            Асуулт байвал: <span className="underline">support@example.com</span>
          </p>
        </div>

        <div>
          <h2 className="font-medium">10. Зөвшөөрөл</h2>
          <p>
            Үйлчилгээг ашигласнаар та эдгээр нөхцлийг
            хүлээн зөвшөөрсөнд тооцогдоно.
          </p>
        </div>
      </section>
    </main>
  );
}
