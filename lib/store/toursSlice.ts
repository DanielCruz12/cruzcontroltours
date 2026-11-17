// Slice de tours: catálogo servido por el backend (`GET /tours`, …).
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTour as apiCreateTour,
  deleteTour as apiDeleteTour,
  listTours as apiListTours,
  updateTour as apiUpdateTour,
  type NewTourInput,
  type Tour,
} from "@/lib/api/tours";
import { toErrorMessage } from "@/lib/api/client";
import type { RequestStatus } from "./customersSlice";

export type ToursState = {
  items: Tour[];
  listStatus: RequestStatus;
  listError: string | null;
  saveStatus: RequestStatus;
  saveError: string | null;
};

const initialState: ToursState = {
  items: [],
  listStatus: "idle",
  listError: null,
  saveStatus: "idle",
  saveError: null,
};

export const fetchTours = createAsyncThunk<
  Tour[],
  void,
  { rejectValue: string }
>("tours/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await apiListTours();
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

export const createTour = createAsyncThunk<
  Tour,
  NewTourInput,
  { rejectValue: string }
>("tours/create", async (input, { rejectWithValue }) => {
  try {
    return await apiCreateTour(input);
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

export const updateTour = createAsyncThunk<
  Tour,
  { id: number; input: NewTourInput },
  { rejectValue: string }
>("tours/update", async ({ id, input }, { rejectWithValue }) => {
  try {
    return await apiUpdateTour(id, input);
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

export const removeTour = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("tours/remove", async (id, { rejectWithValue }) => {
  try {
    await apiDeleteTour(id);
    return id;
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    resetSave(state) {
      state.saveStatus = "idle";
      state.saveError = null;
    },
  },
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
      })
      .addCase(createTour.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(createTour.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createTour.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.payload ?? "No se pudo guardar el tour.";
      })
      .addCase(updateTour.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(updateTour.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(updateTour.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.payload ?? "No se pudo guardar el tour.";
      })
      .addCase(removeTour.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { resetSave } = toursSlice.actions;
export default toursSlice.reducer;
