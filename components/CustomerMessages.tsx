"use client";

import { useEffect, useState } from "react";
import { CakeIcon, MailIcon, PhoneIcon, TrashIcon } from "./icons";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCustomers, removeCustomer } from "@/lib/store/customersSlice";
import type { Customer } from "@/lib/api/customers";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "AAAA-MM-DD" -> fecha local (evita que el huso horario la mueva un día). */
function formatBirthDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MessageCard({
  customer,
  deleting,
  onDelete,
}: {
  customer: Customer;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="rounded-2xl bg-white p-4 shadow-xl shadow-charcoal/10 ring-1 ring-ink/5 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-ink sm:text-base">
            {customer.nombre}
          </p>
          {customer.createdAt && (
            <p className="mt-0.5 text-xs text-ink-faint">
              {formatDate(customer.createdAt)}
            </p>
          )}
        </div>
        {confirming ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={deleting}
              onClick={() => onDelete(customer.id)}
              className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Borrando…" : "Sí, borrar"}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => setConfirming(false)}
              className="rounded-full bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:bg-ink/10 disabled:opacity-60"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Borrar mensaje de ${customer.nombre}`}
            className="grid size-9 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <TrashIcon className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs sm:text-sm">
        <a
          href={`mailto:${customer.correo}`}
          className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 hover:underline"
        >
          <MailIcon className="size-3.5" />
          {customer.correo}
        </a>
        <a
          href={`tel:${customer.telefono}`}
          className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 hover:underline"
        >
          <PhoneIcon className="size-3.5" />
          {customer.telefono}
        </a>
        {customer.telefonoSecundario && (
          <a
            href={`tel:${customer.telefonoSecundario}`}
            className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 hover:underline"
          >
            <PhoneIcon className="size-3.5" />
            {customer.telefonoSecundario}
          </a>
        )}
        {customer.fechaNacimiento && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-900">
            <CakeIcon className="size-3.5" />
            {formatBirthDate(customer.fechaNacimiento)}
          </span>
        )}
      </div>

      {customer.mensaje ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
          {customer.mensaje}
        </p>
      ) : (
        <p className="mt-3 text-sm italic text-ink-faint">Sin mensaje escrito.</p>
      )}
    </li>
  );
}

/** Bandeja de mensajes de la tabla `customers` (GET + DELETE /customers). */
export default function CustomerMessages() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.customers.items);
  const listStatus = useAppSelector((state) => state.customers.listStatus);
  const listError = useAppSelector((state) => state.customers.listError);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchCustomers());
  }, [dispatch, listStatus]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(removeCustomer(id)).unwrap();
    } catch {
      // Si falla, la tarjeta sigue visible; el usuario puede reintentar.
    } finally {
      setDeletingId(null);
    }
  };

  if (listStatus === "loading" || listStatus === "idle") {
    return (
      <p role="status" className="py-10 text-center text-sm font-semibold text-ink-soft">
        Cargando mensajes…
      </p>
    );
  }

  if (listStatus === "failed") {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-xl shadow-charcoal/10 ring-1 ring-ink/5">
        <p role="alert" className="text-sm font-semibold text-red-700">
          {listError ?? "No se pudieron cargar los mensajes."}
        </p>
        <button
          type="button"
          onClick={() => dispatch(fetchCustomers())}
          className="btn-negro mt-4"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-sm font-semibold text-ink-soft shadow-xl shadow-charcoal/10 ring-1 ring-ink/5">
        Aún no hay mensajes. Cuando alguien llene el formulario de contacto
        aparecerán aquí.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm font-semibold text-ink-soft">
        <span className="font-extrabold text-primary">{items.length}</span>{" "}
        {items.length === 1 ? "mensaje recibido" : "mensajes recibidos"}
      </p>
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {items.map((customer) => (
          <MessageCard
            key={customer.id}
            customer={customer}
            deleting={deletingId === customer.id}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
