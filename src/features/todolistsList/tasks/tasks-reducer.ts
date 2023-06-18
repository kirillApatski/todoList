import {
   todoThunk,
} from 'features/todolistsList/todolists/todolists-reducer'
import {
  AddTaskArgType, Result_Code,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI, UpdateTaskArgType,
  UpdateTaskModelType
} from 'common/api/todolists-api'
import {appActions} from 'app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError,
  createAppAsyncThunk
} from 'common/utils'
import {createSlice} from "@reduxjs/toolkit";
import {clearState} from "common/actions/action.clearState";


const initialState: TasksStateType = {}


const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>(
  'tasks/fetchTasksTC',
  async (todolistId: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
      dispatch(appActions.setAppStatus({status: 'loading'}))
      const response = await todolistsAPI.getTasks(todolistId)
      const tasks = response.data.items
      dispatch(appActions.setAppStatus({status: 'succeeded'}))
      return {tasks, todolistId}
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  })

const removeTaskTC = createAppAsyncThunk(
  'tasks/removeTaskTC',
  async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
      dispatch(appActions.setAppStatus({status: 'loading'}))
      await todolistsAPI.deleteTask(param.todolistId, param.taskId)
      dispatch(appActions.setAppStatus({status: 'succeeded'}))
      return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  })

const addTaskTC = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  'tasks/addTaskTC',
  async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
      dispatch(appActions.setAppStatus({status: 'loading'}))
      const response = await todolistsAPI.createTask(arg)
      if (response.data.resultCode === Result_Code.OK) {
        const task = response.data.data.item
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {task}
      } else {
        handleServerAppError(response.data, dispatch);
        return rejectWithValue(null)
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  }
)

const updateTaskTC = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTaskTC',
  async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
      dispatch(appActions.setAppStatus({status: 'loading'}))
      const state = getState()
      const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
      if (!task) {
        console.warn('task not found in the state')
        return rejectWithValue(null)
      }
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel
      }
      const response = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
      if (response.data.resultCode === Result_Code.OK) {
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return arg
      } else {
        handleServerAppError(response.data, dispatch);
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null)
    }
  }
)


const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(todoThunk.addTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(todoThunk.removeTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(todoThunk.fetchTodolistsTC.fulfilled, (state, action) => {
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
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId);

      tasks[index] = {...tasks[index], ...action.payload.domainModel}
    })
    builder.addCase(clearState.type, () => {
      return {}
    })
  }
})
export const tasksReducer = slice.reducer
export const tasksThunks = {fetchTasksTC, removeTaskTC, updateTaskTC, addTaskTC}

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

