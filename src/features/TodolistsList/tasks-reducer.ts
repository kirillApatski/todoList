import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,

} from './todolists-reducer'
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from 'api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from 'app/store'
import {setAppStatusAC} from 'app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasksTC', (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
  return todolistsAPI.getTasks(todolistId)
    .then((res) => {
      const tasks = res.data.items
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {tasks, todolistId}
    })
})
export const removeTaskTC = createAsyncThunk('tasks/removeTaskTC', (param: {taskId: string, todolistId: string}, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

  return todolistsAPI.deleteTask(param.todolistId, param.taskId)
    .then(() => {
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {taskId: param.taskId, todolistId: param.todolistId}
    })
})

const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    addTaskAC(state, action: PayloadAction<TaskType>) {
      state[action.payload.todoListId].unshift(action.payload)
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId);

      tasks[index] = {...tasks[index], ...action.payload.model}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl) => state[tl.id] = [])
    })
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(t => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1)
      }
    })
  }
})
export const tasksReducer = slice.reducer
export const {updateTaskAC, addTaskAC} = slice.actions



export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        const action = addTaskAC(task)
        dispatch(action)
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(setAppStatusAC({status: 'succeeded'}))

      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {

    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      console.warn('task not found in the state')

      return

    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel
    }

    todolistsAPI.updateTask(todolistId, taskId, apiModel)

      .then(res => {
        if (res.data.resultCode === 0) {
          const action = updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId})
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      })
  }

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}

