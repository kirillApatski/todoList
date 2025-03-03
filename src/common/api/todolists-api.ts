import axios, {AxiosResponse} from 'axios'
import {LoginDataType} from "features/auth/Login";
import {UpdateDomainTaskModelType} from "features/todolistsList/tasks/tasks-reducer";

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '981588b4-bdf2-44d7-86f8-d7ae7d7f8770'
  }
})

// api
export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>('todo-lists');
  },
  createTodolist(title: string) {
    return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>('todo-lists', {title});
  },
  deleteTodolist(params:{id: string}) {
    return instance.delete<ResponseType>(`todo-lists/${params.id}`);
  },
  updateTodolist(param: {id: string, title: string}) {
    return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`todo-lists/${param.id}`, {title: param.title});
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  }
}

export const authAPI = {
  login(formData: LoginDataType) {
    return instance.post<LoginDataType, AxiosResponse<ResponseType<{ userId: string }>>>('auth/login', formData)
  },
  me() {
    return instance.get<ResponseType<AutMeResponseType>>('auth/me')
  },
  logOut() {
    return instance.delete<ResponseType>('auth/login')
  }
}

// types

export type AutMeResponseType = {
  id: number
  email: string
  login: string
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  fieldsErrors: Array<string>
  data: D
}


export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4
}

export enum Result_Code {
  OK = 0,
  ERROR = 1,
  CAPTCHA = 10
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}

export type AddTaskArgType = {
  title: string
  todolistId: string
}

export type UpdateTaskArgType = {
  taskId: string
  domainModel: UpdateDomainTaskModelType
  todolistId: string
}



