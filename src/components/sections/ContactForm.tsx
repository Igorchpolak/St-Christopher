"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { sendContactMessage } from "@/app/actions";
import Button from "@/components/ui/Button";
import {
  CONTACT_MESSAGE_MAX,
  validateContactField,
  validateContactPayload,
  type ContactErrors,
} from "@/lib/validation";
import type { ContactPayload } from "@/types";

type FieldName = keyof ContactPayload;
type SendStatus = "idle" | "sending" | "success" | "error";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY_VALUES: ContactFormValues = { name: "", email: "", phone: "", message: "" };
const FIELD_ORDER: FieldName[] = ["name", "email", "phone", "message"];

const INPUT_BASE =
  "w-full rounded border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60";

interface FieldConfig {
  name: Exclude<FieldName, "message">;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  inputMode?: "email" | "tel";
}

const FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Imię i nazwisko",
    placeholder: "Imię i nazwisko",
    type: "text",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "E-mail",
    placeholder: "E-mail",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    name: "phone",
    label: "Telefon (opcjonalnie)",
    placeholder: "Telefon",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
  },
];

/** Formularz kontaktowy – walidacja onBlur i przy submit, wysyłka przez server action. */
export default function ContactForm({ className }: { className?: string }) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<SendStatus>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  // Pole do sfokusowania po przerenderowaniu (ref, nie stan – brak dodatkowego renderu).
  const pendingFocusRef = useRef<FieldName | null>(null);

  const isSending = status === "sending";
  const summaryErrors = FIELD_ORDER.filter((field) => Boolean(errors[field]));

  // Fokus na pierwszym błędnym polu po nieudanym submit.
  useEffect(() => {
    const field = pendingFocusRef.current;
    if (!field) return;
    pendingFocusRef.current = null;
    document.getElementById(`contact-${field}`)?.focus();
  });

  function handleChange(
    field: FieldName,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
    // Znikome poprawki czyszczą błąd pola i baner statusu.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (status === "success" || status === "error") setStatus("idle");
  }

  function handleBlur(field: FieldName) {
    const error = validateContactField(field, values[field]);
    setErrors((prev) => {
      if (!error && !prev[field]) return prev;
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  }

  function focusFirstError(fieldErrors: ContactErrors) {
    const first = FIELD_ORDER.find((field) => Boolean(fieldErrors[field]));
    if (first) pendingFocusRef.current = first;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending) return;

    // Honeypot: wypełnione ukryte pole `website` = bot – udajemy sukces.
    const website = honeypotRef.current?.value ?? "";
    if (website.trim().length > 0) {
      setStatus("success");
      setValues(EMPTY_VALUES);
      return;
    }

    const result = validateContactPayload(values);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      focusFirstError(result.errors);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await sendContactMessage(result.data, website);
      if (response.ok) {
        setStatus("success");
        setValues(EMPTY_VALUES);
        return;
      }
      setErrors(response.errors);
      setStatus("idle");
      focusFirstError(response.errors);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className={className}>
      {status === "error" && (
        <p
          role="alert"
          className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.
        </p>
      )}

      {status === "success" && (
        <p
          role="status"
          className="mb-4 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-800"
        >
          Dziękujemy! Odpowiemy najszybciej, jak to możliwe.
        </p>
      )}

      {summaryErrors.length > 0 && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
        >
          <p className="font-semibold">Formularz zawiera błędy:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            {summaryErrors.map((field) => (
              <li key={field}>{errors[field]}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name}>
              <label htmlFor={`contact-${field.name}`} className="sr-only">
                {field.label}
              </label>
              <input
                id={`contact-${field.name}`}
                name={field.name}
                type={field.type}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                value={values[field.name]}
                disabled={isSending}
                onChange={(event) => handleChange(field.name, event)}
                onBlur={() => handleBlur(field.name)}
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={error ? `contact-${field.name}-error` : undefined}
                className={`${INPUT_BASE} ${error ? "border-red-600" : "border-border"}`}
              />
              {error && (
                <p id={`contact-${field.name}-error`} className="mt-1 text-xs text-red-700">
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <div>
          <label htmlFor="contact-message" className="sr-only">
            Wiadomość
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="Wiadomość"
            value={values.message}
            maxLength={CONTACT_MESSAGE_MAX}
            disabled={isSending}
            onChange={(event) => handleChange("message", event)}
            onBlur={() => handleBlur("message")}
            aria-invalid={Boolean(errors.message) || undefined}
            aria-describedby={
              errors.message
                ? "contact-message-error contact-message-counter"
                : "contact-message-counter"
            }
            className={`${INPUT_BASE} resize-y ${errors.message ? "border-red-600" : "border-border"}`}
          />
          <div className="mt-1 flex items-start justify-between gap-3">
            {errors.message ? (
              <p id="contact-message-error" className="text-xs text-red-700">
                {errors.message}
              </p>
            ) : (
              <span />
            )}
            <p id="contact-message-counter" className="shrink-0 text-xs text-muted">
              {values.message.length} / {CONTACT_MESSAGE_MAX}
            </p>
          </div>
        </div>
      </div>

      {/* Honeypot przeciw botom – ukryty dla ludzi i czytników. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Strona internetowa</label>
        <input
          ref={honeypotRef}
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" variant="gold" className="mt-4 w-full" disabled={isSending}>
        {isSending ? "Wysyłam…" : "Wyślij wiadomość"}
      </Button>
    </form>
  );
}
