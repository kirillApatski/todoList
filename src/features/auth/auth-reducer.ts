import {
  appActions,
} from 'app/app-reducer'
import {LoginDataType} from "./Login";
import {authAPI, Result_Code} from "common/api/todolists-api";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearState} from "common/actions/action.clearState";

const initialState = {
  isLoggedIn: false
}

const loginTC = createAppAsyncThunk<{isLoggedIn: boolean}, LoginDataType>(
  'auth/login',
  async (param: LoginDataType, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

    try {
      dispatch(appActions.setAppStatus({status: 'loading'}))
      const response = await authAPI.login(param)
      if (response.data.resultCode === Result_Code.OK) {
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {isLoggedIn: true}
      } else {

        handleServerAppError(response.data, thunkAPI.dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch)
      return rejectWithValue(null)
    }
  })

const logOutTC = createAppAsyncThunk<{isLoggedIn: boolean}>(
  'auth/logOut',
  async (_, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))

    try {
      const response = await authAPI.logOut()
      if (response.data.resultCode === Result_Code.OK) {
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        dispatch(clearState())
        return {isLoggedIn: false}
      } else {
        handleServerAppError(response.data, thunkAPI.dispatch)
        return {isLoggedIn: true}
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, thunkAPI.dispatch)
      return rejectWithValue(null)
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
    builder.addCase(logOutTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  }

})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunk = {loginTC, logOutTC}





