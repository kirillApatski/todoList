import {TodolistDomainType, todolistsReducer, todoThunk} from 'features/todolistsList/todolists/todolists-reducer';
import {tasksReducer, TasksStateType} from 'features/todolistsList/tasks/tasks-reducer';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const args = {
        todolist:{
            id: 'any id',
            title: 'new todolist',
            addedDate: '',
            order: 0
        }
    }

    const action = todoThunk.addTodolistTC.fulfilled(
      args,
      'requestId',
      args.todolist.id
    );

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
