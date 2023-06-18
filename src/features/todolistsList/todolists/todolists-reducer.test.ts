import {
  changeTodolistFilterAC,
  FilterValuesType,
  TodolistDomainType,
  todolistsReducer, todoThunk
} from 'features/todolistsList/todolists/todolists-reducer';
import {v1} from 'uuid';

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: "idle"},
    {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: "idle"}
  ]
})

test('correct todolist should be removed', () => {
  const args = {id: todolistId1}
  const endState = todolistsReducer(startState, todoThunk.removeTodolistTC.fulfilled(
    args,
    'requestId',
    args
  ))

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
  let newTodolistTitle = "New Todolist";
  const args = {
    todolist: {
      id: '123',
      title: newTodolistTitle,
      addedDate: '',
      order: 0
    }
  }
  const endState = todolistsReducer(startState, todoThunk.addTodolistTC.fulfilled(
    args,
    'requestId',
    args.todolist.id
  ))

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle);
  expect(endState[0].filter).toBe("all");
});

test('correct todolist should change its name', () => {
  let newTodolistTitle = "New Todolist";

  const args = {
    id: todolistId2,
    title: newTodolistTitle
  }

  const action = todoThunk.changeTodolistTitleTC.fulfilled(
    args,
    'requestId',
    args
  );

  const endState = todolistsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValuesType = "completed";

  const action = changeTodolistFilterAC({
    id: todolistId2,
    filter: newFilter
  });

  const endState = todolistsReducer(startState, action);

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});

