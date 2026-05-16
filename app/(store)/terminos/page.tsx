import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Lee los términos y condiciones de uso y compra en Droguería Pilar.",
};

const LAST_UPDATED = "16 de mayo de 2026";

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-800">Términos y condiciones</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D1B69] to-[#7C3AED] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="h-7 w-7 opacity-80" />
          <h1 className="text-2xl font-bold">Términos y condiciones</h1>
        </div>
        <p className="text-purple-200 text-sm">Última actualización: {LAST_UPDATED}</p>
        <p className="text-purple-100 text-sm mt-2 leading-relaxed">
          Al utilizar el sitio web de Droguería Pilar aceptas los presentes términos. Te
          recomendamos leerlos detenidamente antes de realizar cualquier compra.
        </p>
      </div>

      {/* Contenido */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed text-sm">

        <Section title="1. Información general">
          <p>
            <strong>Droguería Pilar</strong> es una tienda de droguería y perfumería en línea
            con domicilio en Bogotá, Colombia. A través de este sitio web ofrecemos productos de
            salud, belleza y cuidado personal para ser adquiridos de manera segura por internet.
          </p>
        </Section>

        <Section title="2. Condiciones de uso">
          <p>Para utilizar nuestro sitio web debes:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-gray-600">
            <li>Ser mayor de 18 años o contar con autorización de un tutor legal.</li>
            <li>Proporcionar información veraz y actualizada en tu cuenta y pedidos.</li>
            <li>No utilizar el sitio para actividades fraudulentas o ilícitas.</li>
            <li>No intentar acceder a áreas restringidas del sistema.</li>
          </ul>
        </Section>

        <Section title="3. Registro y cuenta de usuario">
          <p>
            Al crear una cuenta eres responsable de mantener la confidencialidad de tu
            contraseña y de todas las actividades realizadas bajo tu sesión. Notifícanos
            inmediatamente si sospechas un uso no autorizado de tu cuenta.
          </p>
          <p className="mt-2">
            Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estos términos.
          </p>
        </Section>

        <Section title="4. Productos y precios">
          <p>
            Todos los precios publicados incluyen IVA y están expresados en la moneda indicada en
            el sitio. Nos reservamos el derecho de modificar precios en cualquier momento, pero
            los cambios no afectarán pedidos ya confirmados.
          </p>
          <p className="mt-2">
            Las imágenes de los productos son de carácter ilustrativo. Hacemos nuestro mejor
            esfuerzo para que reflejen fielmente el producto real.
          </p>
          <p className="mt-2">
            La disponibilidad de productos está sujeta al stock existente. En caso de que un
            producto no esté disponible tras confirmar tu pedido, te contactaremos para ofrecerte
            una alternativa o realizar el reembolso correspondiente.
          </p>
        </Section>

        <Section title="5. Proceso de compra">
          <p>El proceso de compra sigue los siguientes pasos:</p>
          <ol className="list-decimal list-inside space-y-1.5 mt-2 text-gray-600">
            <li>Selección de productos y adición al carrito.</li>
            <li>Revisión del carrito y aplicación de cupones (si aplica).</li>
            <li>Ingreso de datos de envío y selección de método de pago.</li>
            <li>Confirmación del pedido y pago.</li>
            <li>Recepción de correo de confirmación con número de pedido.</li>
          </ol>
          <p className="mt-2">
            El contrato de compraventa se perfecciona una vez recibas la confirmación de pedido
            por correo electrónico.
          </p>
        </Section>

        <Section title="6. Pagos">
          <p>
            Aceptamos pagos mediante tarjeta de crédito y débito a través de <strong>Stripe</strong>,
            plataforma certificada PCI-DSS. Droguería Pilar no almacena datos de tarjetas bancarias.
          </p>
          <p className="mt-2">
            En caso de error en el cobro o pago duplicado, realizaremos el reembolso en un plazo
            máximo de 5 a 10 días hábiles según el banco emisor.
          </p>
        </Section>

        <Section title="7. Envíos">
          <p>
            Realizamos envíos dentro de Colombia. Los tiempos y costos de envío se mostrarán
            durante el proceso de compra. Droguería Pilar no se hace responsable por demoras
            atribuibles a la empresa de transporte o a causas de fuerza mayor.
          </p>
          <p className="mt-2">
            Una vez despachado el pedido, recibirás un correo con la información de seguimiento.
          </p>
        </Section>

        <Section title="8. Devoluciones y garantías">
          <p>
            Aceptamos devoluciones dentro de los <strong>30 días calendario</strong> siguientes
            a la recepción del pedido, siempre que el producto:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-gray-600">
            <li>Se encuentre en su empaque original sin abrir.</li>
            <li>No haya sido usado ni manipulado.</li>
            <li>No corresponda a medicamentos de venta controlada.</li>
          </ul>
          <p className="mt-2">
            Para iniciar una devolución escríbenos a <strong>info@drogueriapilar.com</strong>
            con tu número de pedido. El costo del envío de devolución será asumido por el cliente,
            salvo que el producto presente defecto de fábrica.
          </p>
        </Section>

        <Section title="9. Propiedad intelectual">
          <p>
            Todo el contenido de este sitio web (textos, imágenes, logotipos, diseño) es
            propiedad de Droguería Pilar o de sus proveedores de contenido y está protegido por
            las leyes de propiedad intelectual colombianas e internacionales. Queda prohibida su
            reproducción sin autorización expresa.
          </p>
        </Section>

        <Section title="10. Limitación de responsabilidad">
          <p>
            Droguería Pilar no será responsable por daños indirectos, pérdidas de datos o
            perjuicios derivados del uso del sitio más allá de lo permitido por la ley colombiana.
            Nuestra responsabilidad máxima estará limitada al valor del pedido implicado.
          </p>
        </Section>

        <Section title="11. Ley aplicable y jurisdicción">
          <p>
            Estos términos se rigen por las leyes de la República de Colombia. Cualquier
            controversia será sometida a la jurisdicción de los tribunales competentes de la
            ciudad de Bogotá D.C., Colombia.
          </p>
        </Section>

        <Section title="12. Modificaciones">
          <p>
            Podemos actualizar estos términos en cualquier momento. Los cambios entrarán en vigor
            desde su publicación en el sitio. El uso continuado de la tienda tras la publicación
            implica la aceptación de los nuevos términos.
          </p>
        </Section>

        <Section title="13. Contacto">
          <div className="bg-gray-50 rounded-xl p-4 space-y-1">
            <p><strong>Droguería Pilar</strong></p>
            <p>Email: <a href="mailto:info@drogueriapilar.com" className="text-[#7C3AED] hover:underline">info@drogueriapilar.com</a></p>
            <p>Bogotá, Colombia</p>
          </div>
        </Section>
      </div>

      <p className="text-center text-xs text-gray-400">
        También puedes consultar nuestra{" "}
        <Link href="/politica-privacidad" className="text-[#7C3AED] hover:underline">Política de privacidad</Link>.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}
