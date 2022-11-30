import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from './store'
import {RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Login} from "../features/Login/Login";
import {Routes, Route, Navigate} from "react-router-dom";
import {initializeAppTC, logOutTC} from "../features/Login/auth-reducer";
import {CircularProgress} from "@mui/material";

type PropsType = {
    demo?: boolean
}

export enum ROUTE {
    DEFAULT = '/',
    LOGIN = '/login',
    NOT_FOUND = '/404'
}

function App({demo = false}: PropsType) {
    const dispatch = useDispatch()
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)

    const logOut = () => {
        dispatch(logOutTC())
    }

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])

    if(!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    { isLoggedIn && <Button color="inherit" onClick={logOut}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={ROUTE.DEFAULT} element={<TodolistsList demo={demo}/>}/>
                    <Route path={ROUTE.LOGIN} element={<Login/>}/>
                    <Route path='/404' element={<h1 style={{color: 'red', textAlign: 'center', fontSize: '100px'}}>404: PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to={ROUTE.NOT_FOUND}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
