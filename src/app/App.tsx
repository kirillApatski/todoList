import React, {FC, useEffect} from 'react'
import './App.css'
import {TodolistsList} from 'features/todolistsList/todolistsList'
import {useDispatch} from 'react-redux'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from 'common/components/ErrorSnackbar/ErrorSnackbar'
import {Login} from "features/auth/Login";
import {Routes, Route, Navigate} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {selectorIsInitialized, selectorStatus} from "app/app.selectors";
import {selectorIsLoggedIn} from "features/auth/auth.selectors";
import {appThunk} from "app/app-reducer";
import {authThunk} from "features/auth/auth-reducer";
import {useAppSelector} from "common/hooks/useApp";
import {useActions} from "common/hooks/useActions";

type PropsType = {
    demo?: boolean
}

export enum ROUTE {
    DEFAULT = '/',
    LOGIN = '/login',
    NOT_FOUND = '/404'
}

export const App: FC<PropsType> = ({demo = false}) => {
    const dispatch = useDispatch()
    const status = useAppSelector(selectorStatus)
    const isInitialized = useAppSelector(selectorIsInitialized)
    const isLoggedIn = useAppSelector(selectorIsLoggedIn)
    const {initializeAppTC} = useActions(appThunk)
    const {logOutTC} = useActions(authThunk)

    const logOut = () => {
        logOutTC()
    }

    useEffect(() => {
        initializeAppTC()
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
