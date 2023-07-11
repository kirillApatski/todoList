import React, {ChangeEvent} from 'react'
import {EditableSpan} from 'common/components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from 'common/api/todolists-api'
import {useActions} from "common/hooks/useActions";
import {tasksThunks} from "features/todolistsList/tasks/tasks-reducer";

type TaskPropsType = {
    task: TaskType
    todolistId: string
    disable: boolean
}
export const Task = React.memo((props: TaskPropsType) => {
    const {removeTaskTC, updateTaskTC} = useActions(tasksThunks)

    const removeTaskHandler = () => {
        removeTaskTC({taskId: props.task.id, todolistId: props.todolistId})
    }

    const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = props.task.status === TaskStatuses.Completed ? TaskStatuses.New : TaskStatuses.Completed
        updateTaskTC({ taskId: props.task.id, domainModel: {status}, todolistId: props.todolistId})
    }

    const onTitleChangeHandler = ( title: string) => {
        updateTaskTC({ taskId: props.task.id, domainModel: {title}, todolistId: props.todolistId})
    }

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeStatusHandler}
            disabled={props.disable}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} disable={props.disable}/>
        <IconButton onClick={removeTaskHandler} disabled={props.disable}>
            <Delete/>
        </IconButton>
    </div>
})
