import React, {useState} from 'react';
import './App.css';
import TodoList from "./Component/TodoList/TodoList";
import {v1} from "uuid";

export type FilteredType = 'all' | 'active' | 'completed'

function App() {
    const [tasks, setTasks] = useState([
        { id: v1(), title: "HTML&CSS", isDone: true },
        { id: v1(), title: "JS", isDone: true },
        { id: v1(), title: "ReactJS", isDone: false },
        { id: v1(), title: "Rest API", isDone: false },
        { id: v1(), title: "GraphGL", isDone: false },
    ])

    const [filter, setFilter] = useState<FilteredType>('all')
    let filteredTasks = tasks
    if(filter === 'active'){
        filteredTasks = tasks.filter(task => !task.isDone)
    }
    if(filter === 'completed'){
        filteredTasks = tasks.filter(task => task.isDone )
    }


    const removeTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id))
    }
    const changeFilter = (value: FilteredType) => {
        setFilter(value)
    }
    const addTasks = (title: string) => {
        let newTask = {
            id: v1(),
            title,
            isDone: false
        }
        setTasks([newTask, ...tasks])
    }
    const changeTaskStatus = (id: string , isDone: boolean) => {
        setTasks(tasks.map(task => task.id === id ? {...task, isDone} : task))
    }
    return (
        <div className="App">
            <TodoList
                title="JS"
                tasks={filteredTasks}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTasks={addTasks}
                changeTaskStatus={changeTaskStatus}
            />
        </div>
    );
}

export default App;
