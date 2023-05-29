import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI, Result_Code} from "common/api/todolists-api";
import {authActions} from "features/auth/auth-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";


export type AppInitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: null as string | null
}


export const initializeAppTC = createAppAsyncThunk(
  'app/initializeAppTC',
  async (_, thunkAPI) => {

      const {dispatch, rejectWithValue} = thunkAPI

      try {

          dispatch(appActions.setAppStatus({status: 'loading'}))
          const response = await authAPI.me()

          if(response.data.resultCode === Result_Code.OK) {

              dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
              dispatch(appActions.setIsInitializedAC({isInitialized: true}))
              dispatch(appActions.setAppStatus({status: 'succeeded'}))

          } else {

              handleServerAppError(response.data, dispatch)
              return rejectWithValue(null)
          }
      } catch (e) {
          handleServerNetworkError(e, dispatch)
          return rejectWithValue(null)
      }
  }
)

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setIsInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions



