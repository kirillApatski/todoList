import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
    changeTodolistFilterAC,
    FilterValuesType,
    todoThunk
} from './todolists-reducer'
import { tasksThunks } from './tasks-reducer'
import { TaskStatuses } from 'common/api/todolists-api'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import {Navigate} from "react-router-dom";
import {ROUTE} from "app/App";
import {selectorIsLoggedIn} from "features/auth/auth.selectors";
import {selectorTodolists} from "features/TodolistsList/todolists.selectors";
import {selectorTasks} from "features/TodolistsList/tasks.selectors";
import {useActions} from "common/hooks/useActions";
import {useAppSelector} from "common/hooks/useApp";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useAppSelector(selectorTodolists)
    const tasks = useAppSelector(selectorTasks)
    const isLoggedIn = useAppSelector(selectorIsLoggedIn)
    const {addTaskTC, removeTaskTC, updateTaskTC} = useActions(tasksThunks)
    const {addTodolistTC, fetchTodolistsTC, removeTodolistTC, changeTodolistTitleTC} = useActions(todoThunk)

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolistsTC()
    }, [dispatch])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        removeTaskTC({taskId, todolistId})
    }, [dispatch])

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskTC({title, todolistId})
    }, [dispatch])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTaskTC({ taskId, domainModel: {status}, todolistId})
    }, [dispatch])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        updateTaskTC({ taskId, domainModel: {title}, todolistId})
    }, [dispatch])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC({id:todolistId, filter: value}))
    }, [dispatch])

    const removeTodolist = useCallback(function (id: string) {
        removeTodolistTC({id})
    }, [dispatch])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        changeTodolistTitleTC({id, title})
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        addTodolistTC(title)
    }, [dispatch])


    if(!isLoggedIn){
        return <Navigate to={ROUTE.LOGIN}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                entityStatus={tl.entityStatus}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
