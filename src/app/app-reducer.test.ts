import {appActions, AppInitialStateType, appReducer} from "app/app-reducer";


let startStart: AppInitialStateType

beforeEach( () => {
  startStart = {
    error: null,
    status: 'idle',
    isInitialized: false
  }
});

test( 'correct error message should be srt', () => {
  const endState = appReducer(startStart, appActions.setAppErrorAC({error: 'some error'}))
  expect(endState.error).toBe('some error')
} )

test( 'correct status should be srt', () => {
  const endState = appReducer(startStart, appActions.setAppStatusAC({status: 'loading'}) )
  expect(endState.status).toBe('loading')
} )