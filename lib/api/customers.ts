// Endpoints de customers (tabla `customers`): formulario de contacto.
// Backend: POST/GET /customers, GET/DELETE /customers/:id

import { apiFetch } from "./client";

export type Customer = {
  id: string;
  nombre: string;
  telefono: string;
  telefonoSecundario: string | null;
  fechaNacimiento: string | null;
  correo: string;
  mensaje: string | null;
  createdAt: string;
};

export type NewCustomerInput = {
  nombre: string;
  telefono: string;
  telefonoSecundario?: string;
  fechaNacimiento?: string;
  correo: string;
  mensaje?: string;
};

export function listCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>("/customers");
}

export function getCustomer(id: string): Promise<Customer> {
  return apiFetch<Customer>(`/customers/${id}`);
}

export function createCustomer(input: NewCustomerInput): Promise<Customer> {
  return apiFetch<Customer>("/customers", { method: "POST", body: input });
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiFetch<void>(`/customers/${id}`, { method: "DELETE" });
}
