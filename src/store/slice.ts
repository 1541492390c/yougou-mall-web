import { createSlice } from '@reduxjs/toolkit'
import { User } from '@/interface/user'
import { ShopCarItem } from 'src/interface/extension'
import { CouponUser } from '@/interface/payment'

const userinfo: User = {}
const couponUserList: Array<CouponUser> = []
const shopCar: Array<ShopCarItem> = []
const isLogin: boolean = !!localStorage.getItem('token')
const aMapKey: string = '7bba558979c7e30aceceb8ff471d93a1'

const slice = createSlice({
    name: 'slice',
    initialState: {
        userinfo,
        couponUserList,
        shopCar,
        isLogin,
        aMapKey
    },
    reducers: {
        setUserinfo: (state, {payload}) => void (state.userinfo = payload),
        setCouponUserList: (state, {payload}) => void (state.couponUserList = payload),
        setShopCar: (state, {payload}) => void (state.shopCar = payload),
        setIsLogin: (state, {payload}) => void (state.isLogin = payload)
    }
})

export const {
    setUserinfo,
    setCouponUserList,
    setShopCar,
    setIsLogin
} = slice.actions

export default slice
