import {tasksThunks, TasksStateType, tasksReducer} from 'features/todolistsList/tasks/tasks-reducer';
import {TaskPriorities, TaskStatuses} from "common/api/todolists-api";
import {todoThunk} from "features/todolistsList/todolists/todolists-reducer";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    "todolistId1": [
      {
        id: "1", title: "CSS", todoListId: 'todolistId1', status: TaskStatuses.New, description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
      },
      {
        id: "2", title: "JS", todoListId: 'todolistId1', status: TaskStatuses.Completed, description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
      },
      {
        id: "3", title: "React", todoListId: 'todolistId1', status: TaskStatuses.New, description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
      }
    ],
    "todolistId2": [
      {
        id: "1", title: "bread", todoListId: 'todolistId2', status: TaskStatuses.New, description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
      },
      {
        id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
      },
      {
        id: "3", title: "tea", status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
      }
    ]
  };
});

test('correct task should be deleted from correct array', () => {
  const param = {taskId: "2", todolistId: "todolistId2"};
  const action = tasksThunks.removeTaskTC.fulfilled(param, 'requestId', param);

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {
  const task = {
    description: "",
    title: "juce",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: '',
    deadline: '',
    id: 'id exists',
    todoListId: "todolistId2",
    order: 0,
    addedDate: ''
  };
  const action = tasksThunks.addTaskTC.fulfilled(
    {task},
    'requestId',
    {title: task.title, todolistId: task.todoListId}
  );

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {
  const args = {
    taskId: '2',
    todolistId: 'todolistId2',
    domainModel: {status: TaskStatuses.New}
  }

  const action = tasksThunks.updateTaskTC.fulfilled(
    args,
    'requestId',
    args
  )

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {
  const args = {
    taskId: "2",
    domainModel: {title: 'yogurt'},
    todolistId: 'todolistId2'
  }
  const action = tasksThunks.updateTaskTC.fulfilled(
    args,
    'requestId',
    args
  )

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});

test('new array should be added when new todolist is added', () => {

  const args = {
    todolist: {
      id: "123",
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

  const endState = tasksReducer(startState, action)


  const keys = Object.keys(endState);
  const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test('propertry with todolistId should be deleted', () => {
  const args = {id: 'todolistId2'}
  const action = todoThunk.removeTodolistTC.fulfilled(
    args,
    'requestId',
    args
  );

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});
