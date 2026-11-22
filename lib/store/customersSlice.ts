// Slice de customers: bandeja de mensajes del formulario de contacto.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCustomer as apiCreateCustomer,
  deleteCustomer as apiDeleteCustomer,
  listCustomers as apiListCustomers,
  type Customer,
  type NewCustomerInput,
} from "@/lib/api/customers";
import { toErrorMessage } from "@/lib/api/client";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export type CustomersState = {
  items: Customer[];
  listStatus: RequestStatus;
  listError: string | null;
  submitStatus: RequestStatus;
  submitError: string | null;
  lastCreated: Customer | null;
};

const initialState: CustomersState = {
  items: [],
  listStatus: "idle",
  listError: null,
  submitStatus: "idle",
  submitError: null,
  lastCreated: null,
};

export const fetchCustomers = createAsyncThunk<
  Customer[],
  void,
  { rejectValue: string }
>("customers/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await apiListCustomers();
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

export const createCustomer = createAsyncThunk<
  Customer,
  NewCustomerInput,
  { rejectValue: string }
>("customers/create", async (input, { rejectWithValue }) => {
  try {
    return await apiCreateCustomer(input);
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

export const removeCustomer = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("customers/remove", async (id, { rejectWithValue }) => {
  try {
    await apiDeleteCustomer(id);
    return id;
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    resetSubmit(state) {
      state.submitStatus = "idle";
      state.submitError = null;
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "No se pudieron cargar los mensajes.";
      })
      .addCase(createCustomer.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
        state.lastCreated = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.lastCreated = action.payload;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.payload ?? "No se pudo enviar el mensaje.";
      })
      .addCase(removeCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { resetSubmit } = customersSlice.actions;
export default customersSlice.reducer;
