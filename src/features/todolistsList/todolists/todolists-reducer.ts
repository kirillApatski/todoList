import {Result_Code, todolistsAPI, TodolistType} from 'common/api/todolists-api'
import {RequestStatusType, appActions} from 'app/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearState} from "common/actions/action.clearState";
import {createAppAsyncThunk, handleServerNetworkError} from "common/utils";

const initialState: Array<TodolistDomainType> = []

const fetchTodolistsTC = createAppAsyncThunk<{todolists: TodolistType[]}>(
  'todo/fetchTodolistsTC',
  async (_, thunkAPI) => {
      const {dispatch, rejectWithValue} = thunkAPI
      try {
          dispatch(appActions.setAppStatus({status: 'loading'}))
          const response = await todolistsAPI.getTodolists()
          dispatch(appActions.setAppStatus({status: 'succeeded'}))
          return {todolists: response.data}
      } catch (e) {
          handleServerNetworkError(e, dispatch)
          return rejectWithValue(null)
      }
  }
)

const removeTodolistTC = createAppAsyncThunk<{ id: string}, {id: string}>(
  'todo/removeTodolistTC',
  async (param:{id: string}, thunkAPI) => {
      const {dispatch, rejectWithValue} = thunkAPI
      try {
          dispatch(appActions.setAppStatus({status: 'loading'}))
          const response = await todolistsAPI.deleteTodolist(param)
          dispatch(appActions.setAppStatus({status: 'succeeded'}))
          if (response.data.resultCode === Result_Code.OK) {
              return { id: param.id }
          } else {
              return rejectWithValue(null)
          }
      } catch (e) {
          handleServerNetworkError(e, dispatch)
          return rejectWithValue(null)
      }
  }
)

const addTodolistTC = createAppAsyncThunk<{todolist: TodolistType}, string>(
  'todo/addTodolistTC',
  async (title: string, thunkAPI) => {
      const {dispatch, rejectWithValue} = thunkAPI
      try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const response = await todolistsAPI.createTodolist(title)
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todolist: response.data.data.item}
      } catch (e) {
          handleServerNetworkError(e, dispatch)
          return rejectWithValue(null)
      }
  }
)

const changeTodolistTitleTC = createAppAsyncThunk<{id: string,title: string}, {id: string,title: string}>(
  'todo/changeTodolistTitleTC',
  async (param: {id: string, title: string}, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
      dispatch(appActions.setAppStatus({status: 'loading'}))
      const response = await todolistsAPI.updateTodolist(param)
      dispatch(appActions.setAppStatus({status: 'succeeded'}))
      return {id: param.id,title: param.title}
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)


const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(todo => ({...todo, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if(index > -1) {
                state.splice(index, 1)
            }
        })
      builder.addCase(addTodolistTC.fulfilled, (state, action) => {
        state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
      })
      builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(todo => todo.id === action.payload.id)
        state[index].title = action.payload.title
      })
        builder.addCase(clearState.type, () => {
            return []
        })
    }
})
export const todolistsReducer = slice.reducer
export const todolistActions = slice.actions
export const todoThunk = {fetchTodolistsTC, removeTodolistTC, addTodolistTC, changeTodolistTitleTC}

export const {
    changeTodolistFilterAC,
} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}