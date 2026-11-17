// Store Redux del front. Se monta una sola vez en <Providers /> (layout).
import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customersSlice";
import toursReducer from "./toursSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    tours: toursReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
