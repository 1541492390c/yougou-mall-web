import { configureStore, createSlice } from '@reduxjs/toolkit'
import { User } from '@/interface/user'

const userinfo: User = {}

const reducer = createSlice({
    name: 'reducer',
    initialState: {
        userinfo
    },
    reducers: {
        setUserinfo: (state, {payload}) => state.userinfo = payload
    }
})

const store = configureStore({
    reducer: reducer.reducer
})

export default store
