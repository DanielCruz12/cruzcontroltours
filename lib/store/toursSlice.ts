// Slice de tours del front: solo listado contra el backend (GET /tours).
// El CRUD completo vive en el panel; el catálogo estático sigue en `lib/tours.ts`.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listTours as apiListTours,
  type ApiTour,
} from "@/lib/api/tours";
import { toErrorMessage } from "@/lib/api/client";
import type { RequestStatus } from "./customersSlice";

export type ToursState = {
  items: ApiTour[];
  listStatus: RequestStatus;
  listError: string | null;
};

const initialState: ToursState = {
  items: [],
  listStatus: "idle",
  listError: null,
};

export const fetchTours = createAsyncThunk<
  ApiTour[],
  void,
  { rejectValue: string }
>("tours/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await apiListTours();
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "No se pudieron cargar los tours.";
      });
  },
});

export default toursSlice.reducer;
