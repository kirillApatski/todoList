import React, {ChangeEvent, KeyboardEvent, FC, useState} from 'react';
import {FilteredType} from "../../App";

type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string) => void
    changeFilter: (value: FilteredType) => void
    addTasks: (title: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
}
type TaskType = {
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
        changeTaskStatus
    }
) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [error, setError] = useState<string | null>(null)

    const addTask = () => {
        if (taskTitle.trim() !== '') {
            addTasks(taskTitle.trim())
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
            addTasks(taskTitle.trim())
            setTaskTitle('')
        } else {
            setError('Title is required')
        }
    }
    const onFilterClickHandler = (filet: FilteredType) => {
        changeFilter(filet)
    }
    return (
        <div>
            <h3>{title}</h3>
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
                        <li key={task.id}>
                            <input type="checkbox" checked={task.isDone}
                                   onChange={(event) => changeTaskStatus(task.id, event.currentTarget.checked)}/>
                            <span>{task.title}</span>
                            <button onClick={() => removeTask(task.id)}>X</button>
                        </li>
                    )
                })}
            </ul>
            <div>
                <button onClick={() => onFilterClickHandler('all')}>All</button>
                <button onClick={() => onFilterClickHandler('active')}>Active</button>
                <button onClick={() => onFilterClickHandler('completed')}>Completed</button>
            </div>
        </div>
    );
};

export default TodoList;