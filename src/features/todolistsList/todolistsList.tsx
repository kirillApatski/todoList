import React, { useCallback, useEffect } from 'react'
import {
    todoThunk
} from 'features/todolistsList/todolists/todolists-reducer'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { Todolist } from 'features/todolistsList/todolists/todolist/todolist'
import {Navigate} from "react-router-dom";
import {ROUTE} from "app/App";
import {selectorIsLoggedIn} from "features/auth/auth.selectors";
import {selectorTodolists} from "features/todolistsList/todolists/todolists.selectors";
import {selectorTasks} from "features/todolistsList/tasks/tasks.selectors";
import {useActions} from "common/hooks/useActions";
import {useAppDispatch, useAppSelector} from "common/hooks/useApp";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(selectorTodolists)
    const tasks = useAppSelector(selectorTasks)
    const isLoggedIn = useAppSelector(selectorIsLoggedIn)
    const {addTodolistTC, fetchTodolistsTC} = useActions(todoThunk)

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolistsTC()
    }, [])

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
                                entityStatus={tl.entityStatus}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
