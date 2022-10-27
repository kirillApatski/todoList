import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./Component/TodoList/TodoList";
import {v1} from "uuid";

export type FilteredType = 'all' | 'active' | 'completed'
export type TodolistType = {
    id: string
    title: string
    filter: FilteredType
}
export type TodolistsType = Array<TodolistType>

type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<TodolistsType>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},

        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })


    const removeTask = (id: string, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = todolistTasks.filter(task => task.id !== id)
        setTasks({...tasks})
    }
    const changeFilter = (value: FilteredType, todolistId: string) => {
        setTodolists(todolists.map(todo => todo.id === todolistId ? {...todo, filter: value} : todo))
    }
    const addTasks = (title: string, todolistsId: string) => {
        let newTask = {
            id: v1(),
            title,
            isDone: false
        }
        let todolistTasks = tasks[todolistsId]
        tasks[todolistsId] = [newTask, ...todolistTasks]
        setTasks({...tasks})
    }
    const changeTaskStatus = (id: string , isDone: boolean, todolistId: string) => {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find(task => task.id === id)
        if(task){
            task.isDone = isDone
        }
        setTasks({...tasks})
    }
    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(todo => todo.id !== todolistId))
    }
    return (
        <div className="App">

            {

                todolists.map((todo) => {
                    let filteredTasks = tasks[todo.id]
                    if(todo.filter === 'active'){
                        filteredTasks = tasks[todo.id].filter(task => !task.isDone)
                    }
                    if(todo.filter === 'completed'){
                        filteredTasks = tasks[todo.id].filter(task => task.isDone )
                    }
                    return (
                        <TodoList
                            key={todo.id}
                            title={todo.title}
                            todolistId={todo.id}
                            tasks={filteredTasks}
                            filter={todo.filter}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            addTasks={addTasks}
                            changeTaskStatus={changeTaskStatus}
                            removeTodolist={removeTodolist}
                        />
                    )
                })
            }

        </div>
    );
}

export default App;
