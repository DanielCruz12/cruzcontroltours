// Store Redux del front. Se monta una sola vez en <Providers /> (layout).
// customers: formulario /contacto + bandeja /mensajes.
// tours: solo listado del backend (GET /tours); el CRUD vive en el panel.
import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customersSlice";
import faqsReducer from "./faqsSlice";
import toursReducer from "./toursSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    faqs: faqsReducer,
    tours: toursReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
