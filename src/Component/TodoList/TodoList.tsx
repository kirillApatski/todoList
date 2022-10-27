import React, {ChangeEvent, KeyboardEvent, FC, useState} from 'react';
import {FilteredType} from "../../App";

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
        removeTodolist
    }
) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [error, setError] = useState<string | null>(null)

    const addTask = () => {
        if (taskTitle.trim() !== '') {
            addTasks(taskTitle.trim(), todolistId)
        } else {
            setError('Title is required')
        }
        setTaskTitle('')
    }
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(event.currentTarget.value)
        setError('')
    }
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && taskTitle.trim() !== '') {
            addTasks(taskTitle.trim(), todolistId)
            setTaskTitle('')
        } else {
            setError('Title is required')
        }
    }
    const onFilterClickHandler = (filet: FilteredType) => {
        changeFilter(filet, todolistId)
    }
    return (
        <div>
            <h3>{title}<button onClick={() => removeTodolist(todolistId)}>X</button></h3>
            <div>
                <input
                    value={taskTitle}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    className={error ? 'error' : ''}
                />
                <button onClick={addTask}>+</button>
                {error && <div className='error-message'>{error}</div>}
            </div>
            <ul>
                {tasks.map(task => {

                    return (
                        <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                            <input type="checkbox" checked={task.isDone}
                                   onChange={(event) => changeTaskStatus(task.id, event.currentTarget.checked, todolistId)}/>
                            <span>{task.title}</span>
                            <button onClick={() => removeTask(task.id, todolistId)}>X</button>
                        </li>
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