import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { deleteKeyService } from "../../../../../services/gateway/key/key";
import error from "../../../../../utils/error";
import { IDeleteKeyState } from ".";

const initialState: IDeleteKeyState = {
  isDeleted: false,
  loading: false,
  error: undefined,
};
export const deleteKey = createAsyncThunk(
  "api/deletekey",
  async (Id: string) => {
    try {
      const response = await deleteKeyService(Id);
      return response.data;
    } catch (error_) {
      const myError = error_ as Error | AxiosError;
      throw axios.isAxiosError(myError) && myError.response
        ? myError.response.data.Errors[0]
        : myError.message;
    }
  }
);
const slice = createSlice({
  name: "deletekey",
  initialState,
  reducers: {},
  extraReducers(builder): void {
    builder.addCase(deleteKey.pending, (state) => {
      state.loading = true;
      state.isDeleted = false;
    });
    builder.addCase(deleteKey.fulfilled, (state) => {
      state.loading = false;
      state.isDeleted = true;
      // console.log("state ", current(state));
    });
    builder.addCase(deleteKey.rejected, (state, action) => {
      state.loading = false;
      state.isDeleted = false;
      // action.payload contains error information
      action.payload = action.error;
      state.error = error(action.payload);
    });
  },
});
export default slice.reducer;
