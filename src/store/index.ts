import { configureStore, createSlice } from '@reduxjs/toolkit'
import { User } from '@/interface/user'
import { ShopCarItem } from '@/interface/other'
import { CouponUser } from '@/interface/payment'

const userinfo: User = {}
const couponUserList: Array<CouponUser> = []
const shopCar: Array<ShopCarItem> = []
const isLogin: boolean = !!localStorage.getItem('token')

const reducer = createSlice({
    name: 'reducer',
    initialState: {
        userinfo,
        couponUserList,
        shopCar,
        isLogin,
        amapKey: '7bba558979c7e30aceceb8ff471d93a1'
    },
    reducers: {
        setUserinfo: (state, {payload}) => void (state.userinfo = payload),
        setCouponUserList: (state, {payload}) => void (state.couponUserList = payload),
        setShopCar: (state, {payload}) => void (state.shopCar = payload),
        setIsLogin: (state, {payload}) => void (state.isLogin = payload)
    }
})

const store = configureStore({
    reducer: reducer.reducer
})

export const {
    setUserinfo,
    setCouponUserList,
    setShopCar,
    setIsLogin
} = reducer.actions

export default store
