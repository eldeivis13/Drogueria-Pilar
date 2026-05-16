import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Conoce cómo Droguería Pilar recopila, usa y protege tus datos personales.",
};

const LAST_UPDATED = "16 de mayo de 2026";

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-800">Política de privacidad</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D1B69] to-[#7C3AED] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-7 w-7 opacity-80" />
          <h1 className="text-2xl font-bold">Política de privacidad</h1>
        </div>
        <p className="text-purple-200 text-sm">Última actualización: {LAST_UPDATED}</p>
        <p className="text-purple-100 text-sm mt-2 leading-relaxed">
          En Droguería Pilar nos comprometemos a proteger tu información personal conforme a la
          Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.
        </p>
      </div>

      {/* Contenido */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed text-sm">

        <Section title="1. Responsable del tratamiento">
          <p>
            <strong>Droguería Pilar</strong> es responsable del tratamiento de los datos personales
            recopilados a través de este sitio web. Para cualquier consulta sobre el manejo de tu
            información puedes contactarnos en <strong>info@drogueriapilar.com</strong>.
          </p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p>Recopilamos la siguiente información cuando interactúas con nuestra tienda:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-gray-600">
            <li>Datos de identificación: nombre, apellido y correo electrónico (al registrarte).</li>
            <li>Datos de contacto: teléfono y dirección de envío (al realizar un pedido).</li>
            <li>Datos de navegación: páginas visitadas, productos consultados y búsquedas realizadas.</li>
            <li>Datos de transacción: historial de pedidos y método de pago (sin almacenar datos bancarios completos).</li>
          </ul>
        </Section>

        <Section title="3. Finalidad del tratamiento">
          <p>Tus datos son utilizados exclusivamente para:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-gray-600">
            <li>Gestionar tu cuenta y procesar tus pedidos.</li>
            <li>Enviarte confirmaciones de compra y actualizaciones de estado del pedido.</li>
            <li>Mejorar la experiencia de navegación y personalizar el contenido.</li>
            <li>Atender tus solicitudes de soporte o devoluciones.</li>
            <li>Cumplir con obligaciones legales y fiscales.</li>
          </ul>
        </Section>

        <Section title="4. Base legal del tratamiento">
          <p>
            El tratamiento de tus datos se basa en el consentimiento que otorgas al registrarte
            o realizar una compra, en la ejecución del contrato de venta, y en el cumplimiento de
            obligaciones legales aplicables en Colombia.
          </p>
        </Section>

        <Section title="5. Conservación de los datos">
          <p>
            Conservamos tus datos durante el tiempo necesario para cumplir las finalidades
            descritas y según lo exija la legislación vigente (mínimo 5 años para registros
            contables y fiscales conforme al Código de Comercio colombiano).
          </p>
        </Section>

        <Section title="6. Compartir información con terceros">
          <p>
            No vendemos ni cedemos tus datos personales a terceros. Solo compartimos información
            con proveedores de servicios necesarios para el funcionamiento de la tienda:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-gray-600">
            <li><strong>Stripe</strong> — procesamiento seguro de pagos.</li>
            <li><strong>Cloudinary</strong> — almacenamiento de imágenes.</li>
            <li><strong>Vercel</strong> — alojamiento del sitio web.</li>
          </ul>
          <p className="mt-2">Todos ellos actúan como encargados del tratamiento bajo acuerdos de confidencialidad.</p>
        </Section>

        <Section title="7. Tus derechos (Habeas Data)">
          <p>
            Conforme a la Ley 1581 de 2012, tienes derecho a:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 text-gray-600">
            <li><strong>Conocer</strong> los datos personales que tenemos sobre ti.</li>
            <li><strong>Actualizar</strong> tu información desde tu cuenta o contactándonos.</li>
            <li><strong>Rectificar</strong> datos inexactos o incompletos.</li>
            <li><strong>Suprimir</strong> tus datos cuando no exista obligación legal de conservarlos.</li>
            <li><strong>Revocar</strong> el consentimiento otorgado en cualquier momento.</li>
          </ul>
          <p className="mt-2">
            Para ejercer estos derechos escríbenos a <strong>info@drogueriapilar.com</strong>.
            Responderemos en un plazo máximo de 15 días hábiles.
          </p>
        </Section>

        <Section title="8. Seguridad de la información">
          <p>
            Implementamos medidas técnicas y organizativas para proteger tus datos contra accesos
            no autorizados, pérdida o alteración. Las contraseñas se almacenan cifradas y las
            comunicaciones se realizan mediante protocolo HTTPS.
          </p>
        </Section>

        <Section title="9. Cookies">
          <p>
            Utilizamos cookies de sesión estrictamente necesarias para el funcionamiento del
            carrito y la autenticación. No utilizamos cookies de seguimiento publicitario de
            terceros sin tu consentimiento previo.
          </p>
        </Section>

        <Section title="10. Cambios en esta política">
          <p>
            Podemos actualizar esta política periódicamente. Notificaremos cambios significativos
            por correo electrónico o mediante un aviso destacado en el sitio. La fecha de última
            actualización aparece al inicio de este documento.
          </p>
        </Section>

        <Section title="11. Contacto">
          <p>
            Si tienes preguntas sobre esta política o el tratamiento de tus datos, contáctanos:
          </p>
          <div className="mt-2 bg-gray-50 rounded-xl p-4 space-y-1">
            <p><strong>Droguería Pilar</strong></p>
            <p>Email: <a href="mailto:info@drogueriapilar.com" className="text-[#7C3AED] hover:underline">info@drogueriapilar.com</a></p>
            <p>Bogotá, Colombia</p>
          </div>
        </Section>
      </div>

      <p className="text-center text-xs text-gray-400">
        También puedes consultar nuestros{" "}
        <Link href="/terminos" className="text-[#7C3AED] hover:underline">Términos y condiciones</Link>.
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
