import { tasksReducer } from 'features/todolistsList/tasks/tasks-reducer';
import { todolistsReducer } from 'features/todolistsList/todolists/todolists-reducer';
import {AnyAction, combineReducers} from 'redux'
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk'
import { appReducer } from './app-reducer'
import {authReducer} from "features/auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})


export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store;
