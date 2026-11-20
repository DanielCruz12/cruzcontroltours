"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Sin almacenamiento: igual se oculta el aviso.
    }
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 250);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className={`fixed inset-x-4 bottom-4 z-50 rounded-[24px] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/10 transition-all duration-300 motion-safe:animate-[cookie-in_300ms_ease-out] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm ${
        leaving ? "translate-y-4 opacity-0" : ""
      }`}
    >
      <p className="text-base font-bold text-neutral-900">Usamos cookies</p>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Utilizamos cookies propias para que el sitio funcione mejor y recordar
        tus preferencias. Puedes aceptar o rechazar su uso.{" "}
        <a
          href="/privacidad"
          className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
        >
          Leer política
        </a>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => choose("declined")}
          className="flex-1 rounded-[14px] border border-neutral-200 px-6 py-3 text-[15px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="btn-negro flex-1"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
