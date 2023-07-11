import React, { useEffect } from 'react'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Delete } from '@mui/icons-material';
import { Task } from 'features/todolistsList/tasks/task/Task'
import { TaskStatuses, TaskType } from 'common/api/todolists-api'
import {
    FilterValuesType,
    todolistActions,
    TodolistDomainType,
    todoThunk
} from 'features/todolistsList/todolists/todolists-reducer'
import {useDispatch} from 'react-redux'
import { tasksThunks } from 'features/todolistsList/tasks/tasks-reducer'

import {Navigate} from "react-router-dom";
import {ROUTE} from "app/App";
import {selectorIsLoggedIn} from "features/auth/auth.selectors";
import {useAppSelector} from "common/hooks/useApp";
import {useActions} from "common/hooks/useActions";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
    entityStatus: string
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {

    const isLoggedIn = useAppSelector(selectorIsLoggedIn)

    const {removeTodolistTC, changeTodolistTitleTC} = useActions(todoThunk)
    const {addTaskTC} = useActions(tasksThunks)
    const {changeTodolistFilterAC} = useActions(todolistActions)


    const dispatch = useDispatch()
    useEffect(() => {
        if (demo) {
            return
        }
        const thunk = tasksThunks.fetchTasksTC(props.todolist.id)
        dispatch(thunk)
    }, [])

    const addTask = (title: string) => {
        addTaskTC({title, todolistId: props.todolist.id})
    }

    const removeTodolist =  () => {
        removeTodolistTC({id: props.todolist.id})
    }

    const changeTodolistTitle = (title: string) => {
        changeTodolistTitleTC({id: props.todolist.id , title})
    }

    const changeFilterHandler = (value: FilterValuesType) => {
        changeTodolistFilterAC({id: props.todolist.id, filter: value})
    }

    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    if(!isLoggedIn){
        return <Navigate to={ROUTE.LOGIN}/>
    }
    return <div>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}
                                                disable={props.todolist.entityStatus === 'loading'}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('all')}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('active')}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('completed')}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


