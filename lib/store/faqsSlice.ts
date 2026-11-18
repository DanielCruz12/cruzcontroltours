import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listFaqs as apiListFaqs, type Faq } from "@/lib/api/faqs";
import { toErrorMessage } from "@/lib/api/client";
import type { RequestStatus } from "./customersSlice";

export type FaqsState = {
  items: Faq[];
  listStatus: RequestStatus;
  listError: string | null;
};

const initialState: FaqsState = {
  items: [],
  listStatus: "idle",
  listError: null,
};

export const fetchFaqs = createAsyncThunk<
  Faq[],
  void,
  { rejectValue: string }
>("faqs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await apiListFaqs();
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

const faqsSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError =
          action.payload ?? "No se pudieron cargar las preguntas.";
      });
  },
});

export default faqsSlice.reducer;
