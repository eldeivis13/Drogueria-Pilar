import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFrom() {
  return process.env.EMAIL_FROM ?? "Droguería Pilar <onboarding@resend.dev>";
}

// ── Tipos ────────────────────────────────────────────────────────────────────

interface OrderItem {
  productName: string;
  productBrand?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface SendOrderConfirmationParams {
  to: string;
  firstName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingStreet: string;
  shippingCity: string;
  shippingDepartment: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

// ── Plantilla HTML ───────────────────────────────────────────────────────────

function orderConfirmationHtml(p: SendOrderConfirmationParams): string {
  const itemsHtml = p.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f0ff;">
          <span style="font-weight:600;color:#111827;">${item.productName}</span>
          ${item.productBrand ? `<br><span style="font-size:12px;color:#6b7280;">${item.productBrand}</span>` : ""}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f0ff;text-align:center;color:#6b7280;">x${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f0ff;text-align:right;font-weight:600;color:#2D1B69;">${formatPrice(item.subtotal)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmación de pedido</title>
</head>
<body style="margin:0;padding:0;background:#F0EEF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0EEF8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#2D1B69;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                💊 Droguería Pilar
              </h1>
              <p style="margin:8px 0 0;color:#c4b5fd;font-size:14px;">Tu pedido está confirmado</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;">

              <!-- Saludo -->
              <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">¡Gracias, ${p.firstName}! 🎉</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                Hemos recibido tu pedido y el pago ha sido procesado correctamente.
                Te avisaremos cuando tu pedido esté en camino.
              </p>

              <!-- Número de pedido -->
              <div style="background:#f3f0ff;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Número de pedido</p>
                <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#2D1B69;">${p.orderNumber}</p>
              </div>

              <!-- Productos -->
              <h3 style="margin:0 0 12px;font-size:15px;color:#111827;">Resumen del pedido</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <thead>
                  <tr>
                    <th style="text-align:left;font-size:12px;color:#9ca3af;font-weight:600;padding-bottom:8px;border-bottom:2px solid #f3f0ff;">Producto</th>
                    <th style="text-align:center;font-size:12px;color:#9ca3af;font-weight:600;padding-bottom:8px;border-bottom:2px solid #f3f0ff;">Cant.</th>
                    <th style="text-align:right;font-size:12px;color:#9ca3af;font-weight:600;padding-bottom:8px;border-bottom:2px solid #f3f0ff;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>

              <!-- Totales -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="font-size:13px;color:#6b7280;padding:4px 0;">Subtotal</td>
                  <td style="font-size:13px;color:#6b7280;text-align:right;padding:4px 0;">${formatPrice(p.subtotal)}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#6b7280;padding:4px 0;">Envío</td>
                  <td style="font-size:13px;padding:4px 0;text-align:right;${p.shippingCost === 0 ? "color:#16a34a;font-weight:600;" : "color:#6b7280;"}">
                    ${p.shippingCost === 0 ? "¡Gratis!" : formatPrice(p.shippingCost)}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:16px;font-weight:800;color:#111827;padding-top:12px;border-top:2px solid #f3f0ff;">Total pagado</td>
                  <td style="font-size:16px;font-weight:800;color:#2D1B69;text-align:right;padding-top:12px;border-top:2px solid #f3f0ff;">${formatPrice(p.total)}</td>
                </tr>
              </table>

              <!-- Dirección -->
              <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#111827;">📦 Dirección de entrega</p>
                <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                  ${p.shippingStreet}<br/>
                  ${p.shippingCity}, ${p.shippingDepartment}
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "https://drogueria-pilar.vercel.app"}/cuenta/pedidos"
                   style="display:inline-block;background:#2D1B69;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
                  Ver mis pedidos
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f0ff;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                ¿Tienes alguna pregunta? Escríbenos a
                <a href="mailto:info@drogueriapilar.es" style="color:#2D1B69;text-decoration:none;">info@drogueriapilar.es</a>
                <br/>© 2026 Droguería Pilar · Todos los derechos reservados
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Función principal ─────────────────────────────────────────────────────────

export async function sendOrderConfirmation(params: SendOrderConfirmationParams) {
  try {
    const { data, error } = await getResend().emails.send({
      from: getFrom(),
      to: params.to,
      subject: `✅ Pedido confirmado — ${params.orderNumber}`,
      html: orderConfirmationHtml(params),
    });

    if (error) {
      console.error("[Resend] Error enviando email:", error);
      return { success: false, error };
    }

    console.log("[Resend] Email enviado:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Resend] Excepción:", err);
    return { success: false, error: err };
  }
}
