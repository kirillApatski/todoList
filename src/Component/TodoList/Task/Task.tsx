import React, {FC} from 'react';
import {EditableSpan} from "../../common/EditableSpan/EditableSpan";
import {TaskType} from "../TodoList";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";

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
            <Checkbox defaultChecked color="success" checked={task.isDone}
                      onChange={(event) => changeTaskStatus(task.id, event.currentTarget.checked, todolistId)}/>
            <input type="checkbox" checked={task.isDone}
                   onChange={(event) => changeTaskStatus(task.id, event.currentTarget.checked, todolistId)}/>
            <EditableSpan value={task.title} onChange={onChangeTaskTitleHandler}/>
            <IconButton aria-label="delete" onClick={() => removeTask(task.id, todolistId)}>
                <Delete/>
            </IconButton>
        </li>
    );
};

