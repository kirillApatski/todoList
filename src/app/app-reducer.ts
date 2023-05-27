import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {authAPI, Result_Code} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {authActions} from "features/Login/auth-reducer";


export type AppInitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: null as string | null
}



export const initializeAppTC = () => async (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatusAC({status: 'loading'}))
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === Result_Code.OK) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
            dispatch(appActions.setIsInitializedAC({isInitialized: true}))
            dispatch(appActions.setAppStatusAC({status: 'succeeded'}))

        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as { message: string }, dispatch)
    } finally {
        dispatch(appActions.setIsInitializedAC({isInitialized: true}))
    }

    dispatch(appActions.setAppStatusAC({status: 'succeeded'}))

}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setIsInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions



