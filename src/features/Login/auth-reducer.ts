import {
  appActions,
} from 'app/app-reducer'
import {LoginDataType} from "./Login";
import {authAPI, Result_Code} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false
}

export const loginTC = createAsyncThunk('auth/login', async (param: LoginDataType, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}))
  try {
    const response = await authAPI.login(param)
    if (response.data.resultCode === Result_Code.OK) {
      thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
      return {isLoggedIn: true}
    } else {
      handleServerAppError(response.data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({isLoggedIn: false})
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue({isLoggedIn: false})
  }
})

export const logOutTC = createAsyncThunk('auth/logOut', async (_, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}))
  try {
    const response = await authAPI.logOut()
    if (response.data.resultCode === Result_Code.OK) {
      thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
      return {isLoggedIn: false}
    } else {
      handleServerAppError(response.data, thunkAPI.dispatch)
      return {isLoggedIn: true}

    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, thunkAPI.dispatch)
    return {isLoggedIn: true}
  }
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
      .addCase(logOutTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  }

})

export const authReducer = slice.reducer
export const authActions = slice.actions





