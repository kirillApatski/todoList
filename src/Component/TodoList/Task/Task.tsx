import React, {FC} from 'react';
import {EditableSpan} from "../../common/EditableSpan/EditableSpan";
import {TaskType} from "../TodoList";

type PropsTaskType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (id: string,status: boolean, todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, newTitle: string, ) => void
    removeTask: (taskId: string, todolistId: string) => void
}


export const Task: FC<PropsTaskType> = ({task, removeTask, changeTaskStatus, todolistId,changeTaskTitle}) => {

    const onChangeTaskTitleHandler = (newTitle: string) => {
        changeTaskTitle(todolistId, task.id, newTitle )
    }

    return (
        <li key={task.id} className={task.isDone ? 'is-done' : ''}>
            <input type="checkbox" checked={task.isDone}
                   onChange={(event) => changeTaskStatus(task.id, event.currentTarget.checked, todolistId)}/>
            <EditableSpan value={task.title} onChange={onChangeTaskTitleHandler}/>
            <button onClick={() => removeTask(task.id, todolistId)}>X</button>
        </li>
    );
};

