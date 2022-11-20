import React, {FC} from 'react';
import {FilteredType} from "../../App";
import AddItemForm from "../common/AddItemForm/AddItemForm";
import {EditableSpan} from "../common/EditableSpan/EditableSpan";
import {Task} from "./Task/Task";
import {Button, IconButton} from "@mui/material";
import { Delete } from '@mui/icons-material'

type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    todolistId: string
    filter: FilteredType
    removeTask: (id: string, todolistId: string) => void
    changeFilter: (value: FilteredType, todolistId: string) => void
    addTasks: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistId: string, id: string, newTitle: string) => void
    changeTodolistTitle:(newTitle: string, todolistId: string) => void
}
export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

const TodoList: FC<TodoListPropsType> = (
    {
        title,
        tasks,
        removeTask,
        changeFilter,
        addTasks,
        changeTaskStatus,
        filter,
        todolistId,
        removeTodolist,
        changeTaskTitle,
        changeTodolistTitle
    }
) => {
    const addTaskHandler = (title: string) => {
        addTasks(title, todolistId)
    }
    const onFilterClickHandler = (filet: FilteredType) => {
        changeFilter(filet, todolistId)
    }
    const onChangeTodolistTitle = (newTitle: string) => {
        changeTodolistTitle(newTitle, todolistId)
    }
    return (
        <div>
            <h3>
                <EditableSpan value={title} onChange={onChangeTodolistTitle}/>
                <IconButton aria-label="delete" onClick={() => removeTodolist(todolistId)}>
                    <Delete/>
                </IconButton>
            </h3>
            <div>
                <AddItemForm callback={addTaskHandler}/>
            </div>
            <div>
                {tasks.map(task => {

                    return (
                        <Task
                            key={task.id}
                            todolistId={todolistId}
                            task={task}
                            removeTask={removeTask}
                            changeTaskStatus={changeTaskStatus}
                            changeTaskTitle={changeTaskTitle}
                        />
                    )
                })}
            </div>
            <div>
                <Button variant="contained" color={filter === 'all' ? 'success' : 'inherit'} onClick={() => onFilterClickHandler('all')}>All</Button>
                <Button variant="contained" color={filter === 'active' ? 'success' : 'inherit'} onClick={() => onFilterClickHandler('active')}>Active</Button>
                <Button variant="contained" color={filter === 'completed' ? 'success' : 'inherit'} onClick={() => onFilterClickHandler('completed')}>Completed</Button>
            </div>
        </div>
    );
};

export default TodoList;