import {AppRootStateType} from "app/store";

export const selectorStatus = (state: AppRootStateType) => state.app.status
export const selectorIsInitialized = (state: AppRootStateType) => state.app.isInitialized