"use server";

import { validateContactPayload } from "@/lib/validation";
import type { ContactPayload } from "@/types";

/**
 * Server actions strony głównej.
 */

/**
 * Wysyłka wiadomości z formularza kontaktowego – na razie STUB.
 * Drugi parametr to honeypot (ukryte pole `website` z formularza).
 */
export async function sendContactMessage(
  payload: ContactPayload,
  website?: string,
): Promise<{ ok: true } | { ok: false; errors: Partial<Record<keyof ContactPayload, string>> }> {
  // Honeypot: wypełnione pole `website` = bot. Udajemy sukces bez dalszych działań.
  if (typeof website === "string" && website.trim().length > 0) {
    return { ok: true };
  }

  const result = validateContactPayload(payload);
  if (!result.ok) {
    return result;
  }

  // TODO: podłączyć backend / e-mail.
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.info(
    `[contact] Nowa wiadomość od: ${result.data.name} <${result.data.email}>` +
      (result.data.phone ? `, tel. ${result.data.phone}` : ""),
  );

  return { ok: true };
}
