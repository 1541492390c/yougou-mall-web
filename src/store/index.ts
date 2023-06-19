import { configureStore, createSlice } from '@reduxjs/toolkit'
import { ShopCarItem, User } from '@/interface'

const userinfo: User = {}
const shopCar: Array<ShopCarItem> = []
const isLogin: boolean = !!localStorage.getItem('token')

const reducer = createSlice({
    name: 'reducer',
    initialState: {
        userinfo,
        shopCar,
        isLogin
    },
    reducers: {
        setUserinfo: (state, {payload}) => void(state.userinfo = payload),
        setIsLogin: (state, {payload}) => void(state.isLogin = payload)
    }
})

const store = configureStore({
    reducer: reducer.reducer
})

export const {
    setUserinfo,
    setIsLogin
} = reducer.actions

export default store
