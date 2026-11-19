"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckIcon, MailIcon, PhoneIcon, SendIcon, UsersIcon } from "./icons";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createCustomer,
  resetSubmit,
} from "@/lib/store/customersSlice";

// Límites iguales a los del backend (customerSchema en customer-routes.ts).
const MAX = { nombre: 200, telefono: 50, correo: 255, mensaje: 2000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = { nombre: string; telefono: string; correo: string; mensaje: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { nombre: "", telefono: "", correo: "", mensaje: "" };

function validate(values: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.nombre.trim()) errors.nombre = "Cuéntanos tu nombre.";
  else if (values.nombre.trim().length > MAX.nombre)
    errors.nombre = `Máximo ${MAX.nombre} caracteres.`;
  if (!values.telefono.trim()) errors.telefono = "Déjanos un teléfono o WhatsApp.";
  else if (values.telefono.trim().length > MAX.telefono)
    errors.telefono = `Máximo ${MAX.telefono} caracteres.`;
  if (!values.correo.trim()) errors.correo = "Déjanos tu correo.";
  else if (values.correo.trim().length > MAX.correo)
    errors.correo = `Máximo ${MAX.correo} caracteres.`;
  else if (!EMAIL_RE.test(values.correo.trim()))
    errors.correo = "Revisa el formato del correo.";
  if (values.mensaje.trim().length > MAX.mensaje)
    errors.mensaje = `Máximo ${MAX.mensaje} caracteres.`;
  return errors;
}

const fieldClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink-faint focus:border-sky-deep";

const labelClasses =
  "mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft";

const errorClasses = "mt-1 text-xs font-semibold text-red-700";

/** Formulario de contacto: crea un registro en la tabla `customers` (POST /customers). */
export default function ContactForm() {
  const dispatch = useAppDispatch();
  const submitStatus = useAppSelector((state) => state.customers.submitStatus);
  const submitError = useAppSelector((state) => state.customers.submitError);

  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);

  const sending = submitStatus === "loading";

  const set = (key: keyof Fields) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      await dispatch(
        createCustomer({
          nombre: values.nombre.trim(),
          telefono: values.telefono.trim(),
          correo: values.correo.trim(),
          mensaje: values.mensaje.trim() || undefined,
        }),
      ).unwrap();
      setSent(true);
      setValues(EMPTY);
    } catch {
      // El mensaje de error ya quedó en el slice (submitError).
    }
  };

  const handleReset = () => {
    dispatch(resetSubmit());
    setErrors({});
    setValues(EMPTY);
    setSent(false);
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-2xl bg-white p-6 text-center shadow-xl shadow-charcoal/10 ring-1 ring-ink/5 sm:p-10"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-sky-deep text-white">
          <CheckIcon className="size-6" />
        </span>
        <h2 className="mt-4 text-xl font-extrabold text-ink sm:text-2xl">
          ¡Mensaje enviado!
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          Gracias por escribirnos. Te contactaremos muy pronto por teléfono o
          correo para armar tu itinerario.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="btn-negro mt-6"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-white p-4 shadow-xl shadow-charcoal/10 ring-1 ring-ink/5 sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contacto-nombre" className={labelClasses}>
            <UsersIcon className="size-3.5 text-sky" />
            Nombre *
          </label>
          <input
            id="contacto-nombre"
            type="text"
            autoComplete="name"
            placeholder="Tu nombre completo"
            maxLength={MAX.nombre}
            value={values.nombre}
            onChange={set("nombre")}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? "contacto-nombre-error" : undefined}
            className={fieldClasses}
          />
          {errors.nombre && (
            <p id="contacto-nombre-error" role="alert" className={errorClasses}>
              {errors.nombre}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contacto-telefono" className={labelClasses}>
            <PhoneIcon className="size-3.5 text-sky" />
            Teléfono / WhatsApp *
          </label>
          <input
            id="contacto-telefono"
            type="tel"
            autoComplete="tel"
            placeholder="+503 0000 0000"
            maxLength={MAX.telefono}
            value={values.telefono}
            onChange={set("telefono")}
            aria-invalid={Boolean(errors.telefono)}
            aria-describedby={errors.telefono ? "contacto-telefono-error" : undefined}
            className={fieldClasses}
          />
          {errors.telefono && (
            <p id="contacto-telefono-error" role="alert" className={errorClasses}>
              {errors.telefono}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contacto-correo" className={labelClasses}>
            <MailIcon className="size-3.5 text-sky" />
            Correo *
          </label>
          <input
            id="contacto-correo"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            maxLength={MAX.correo}
            value={values.correo}
            onChange={set("correo")}
            aria-invalid={Boolean(errors.correo)}
            aria-describedby={errors.correo ? "contacto-correo-error" : undefined}
            className={fieldClasses}
          />
          {errors.correo && (
            <p id="contacto-correo-error" role="alert" className={errorClasses}>
              {errors.correo}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contacto-mensaje" className={labelClasses}>
            <SendIcon className="size-3.5 text-sky" />
            Mensaje
            <span className="ml-auto font-semibold normal-case tracking-normal text-ink-faint">
              {values.mensaje.length}/{MAX.mensaje}
            </span>
          </label>
          <textarea
            id="contacto-mensaje"
            rows={5}
            placeholder="Cuéntanos qué tour te interesa, fechas y cuántas personas viajan…"
            maxLength={MAX.mensaje}
            value={values.mensaje}
            onChange={set("mensaje")}
            aria-invalid={Boolean(errors.mensaje)}
            aria-describedby={errors.mensaje ? "contacto-mensaje-error" : undefined}
            className={`${fieldClasses} resize-y`}
          />
          {errors.mensaje && (
            <p id="contacto-mensaje-error" role="alert" className={errorClasses}>
              {errors.mensaje}
            </p>
          )}
        </div>
      </div>

      {submitError && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="btn-negro mt-5 w-full sm:w-auto"
      >
        <SendIcon className="size-4" />
        {sending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
