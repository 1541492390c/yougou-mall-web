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
        isLogin,
        amapKey: '7bba558979c7e30aceceb8ff471d93a1'
    },
    reducers: {
        setUserinfo: (state, {payload}) => void (state.userinfo = payload),
        setShopCar: (state, {payload}) => void (state.shopCar = payload),
        setIsLogin: (state, {payload}) => void (state.isLogin = payload)
    }
})

const store = configureStore({
    reducer: reducer.reducer
})

export const {
    setUserinfo,
    setShopCar,
    setIsLogin,
} = reducer.actions

export default store
