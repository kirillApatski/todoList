import { Dispatch } from 'redux'
import {
    setAppStatusAC,
    setIsInitializedAC,
} from '../../app/app-reducer'
import {LoginDataType} from "./Login";
import {authAPI, Result_Code} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    }

})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


// thunks
export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const response = await authAPI.login(data)
        if(response.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC({value: true}))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as {message: string}, dispatch)
    }
    dispatch(setAppStatusAC({ status:'succeeded'}))

}
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    try {
        const response = await authAPI.me()
        if(response.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setIsInitializedAC({isInitialized: true}))
            dispatch(setAppStatusAC({status:'succeeded'}))

        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as {message: string}, dispatch)
    } finally {
        dispatch(setIsInitializedAC({isInitialized: true}))
    }

    dispatch(setAppStatusAC({status:'succeeded'}))

}

export const logOutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    try {
        const response = await authAPI.logOut()
        if(response.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status:'succeeded'}))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error as {message: string}, dispatch)
    }
    dispatch(setAppStatusAC({status:'succeeded'}))
}
