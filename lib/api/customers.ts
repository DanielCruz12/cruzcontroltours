// Endpoints de customers (tabla `customers`): formulario de contacto.
// Backend: POST/GET /customers, GET/DELETE /customers/:id

import { apiFetch } from "./client";

export type Customer = {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  mensaje: string | null;
  createdAt: string;
};

export type NewCustomerInput = {
  nombre: string;
  telefono: string;
  correo: string;
  mensaje?: string;
};

export function listCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>("/customers");
}

export function getCustomer(id: number): Promise<Customer> {
  return apiFetch<Customer>(`/customers/${id}`);
}

export function createCustomer(input: NewCustomerInput): Promise<Customer> {
  return apiFetch<Customer>("/customers", { method: "POST", body: input });
}

export async function deleteCustomer(id: number): Promise<void> {
  await apiFetch<void>(`/customers/${id}`, { method: "DELETE" });
}
