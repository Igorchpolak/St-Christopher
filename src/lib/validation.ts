import type { ContactPayload } from "@/types";

/**
 * Walidacja formularza kontaktowego – wspólna dla klienta (ContactForm)
 * i serwera (src/app/actions.ts), żeby reguły były zawsze zgodne.
 */

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export type ContactValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; errors: ContactErrors };

export const CONTACT_NAME_MIN = 2;
export const CONTACT_NAME_MAX = 100;
export const CONTACT_PHONE_MIN = 7;
export const CONTACT_PHONE_MAX = 20;
export const CONTACT_MESSAGE_MIN = 10;
export const CONTACT_MESSAGE_MAX = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Cyfry, spacje oraz znaki + - ( )
const PHONE_PATTERN = /^[0-9+()\- ]+$/;

/** Przytnij białe znaki; wartości nie-stringowe traktuj jako puste. */
function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Walidacja pojedynczego pola – zwraca komunikat błędu po polsku lub undefined. */
export function validateContactField(
  field: keyof ContactPayload,
  value: unknown,
): string | undefined {
  switch (field) {
    case "name": {
      const name = toTrimmedString(value);
      if (name.length === 0) return "Podaj imię i nazwisko.";
      if (name.length < CONTACT_NAME_MIN || name.length > CONTACT_NAME_MAX) {
        return `Imię i nazwisko musi mieć od ${CONTACT_NAME_MIN} do ${CONTACT_NAME_MAX} znaków.`;
      }
      return undefined;
    }
    case "email": {
      const email = toTrimmedString(value);
      if (email.length === 0) return "Podaj adres e-mail.";
      if (!EMAIL_PATTERN.test(email)) return "Podaj poprawny adres e-mail.";
      return undefined;
    }
    case "phone": {
      // Telefon opcjonalny – pusta wartość jest poprawna.
      const phone = toTrimmedString(value);
      if (phone.length === 0) return undefined;
      if (
        phone.length < CONTACT_PHONE_MIN ||
        phone.length > CONTACT_PHONE_MAX ||
        !PHONE_PATTERN.test(phone)
      ) {
        return `Telefon może mieć od ${CONTACT_PHONE_MIN} do ${CONTACT_PHONE_MAX} znaków: cyfry, spacje oraz znaki +, -, (, ).`;
      }
      return undefined;
    }
    case "message": {
      const message = toTrimmedString(value);
      if (message.length === 0) return "Wpisz wiadomość.";
      if (message.length < CONTACT_MESSAGE_MIN || message.length > CONTACT_MESSAGE_MAX) {
        return `Wiadomość musi mieć od ${CONTACT_MESSAGE_MIN} do ${CONTACT_MESSAGE_MAX} znaków.`;
      }
      return undefined;
    }
  }
}

const FIELD_ORDER = ["name", "email", "phone", "message"] as const;

/** Walidacja całego formularzu; dane wyjściowe są przycięte (trim) i otypowane. */
export function validateContactPayload(payload: unknown): ContactValidationResult {
  const source =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};

  const name = toTrimmedString(source.name);
  const email = toTrimmedString(source.email);
  const phone = toTrimmedString(source.phone);
  const message = toTrimmedString(source.message);

  const errors: ContactErrors = {};
  const trimmed: Record<keyof ContactPayload, string> = { name, email, phone, message };

  for (const field of FIELD_ORDER) {
    const error = validateContactField(field, trimmed[field]);
    if (error) errors[field] = error;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // Phone jest opcjonalny w ContactPayload – pomijamy, gdy pusty.
  const data: ContactPayload =
    phone.length > 0 ? { name, email, phone, message } : { name, email, message };

  return { ok: true, data };
}
