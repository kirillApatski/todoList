import React, {FC} from 'react';
import {FilteredType} from "../../App";
import AddItemForm from "../common/AddItemForm/AddItemForm";
import {EditableSpan} from "../common/EditableSpan/EditableSpan";
import {Task} from "./Task/Task";

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
                <button onClick={() => removeTodolist(todolistId)}>X</button>
            </h3>
            <div>
                <AddItemForm callback={addTaskHandler}/>
            </div>
            <ul>
                {tasks.map(task => {

                    return (
                        <Task
                            todolistId={todolistId}
                            task={task}
                            removeTask={removeTask}
                            changeTaskStatus={changeTaskStatus}
                            changeTaskTitle={changeTaskTitle}
                        />
                    )
                })}
            </ul>
            <div>
                <button className={filter === 'all' ? 'active-filter' : ''}
                        onClick={() => onFilterClickHandler('all')}>All
                </button>
                <button className={filter === 'active' ? 'active-filter' : ''}
                        onClick={() => onFilterClickHandler('active')}>Active
                </button>
                <button className={filter === 'completed' ? 'active-filter' : ''}
                        onClick={() => onFilterClickHandler('completed')}>Completed
                </button>
            </div>
        </div>
    );
};

export default TodoList;