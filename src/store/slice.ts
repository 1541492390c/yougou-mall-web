import { createSlice } from '@reduxjs/toolkit'
import { User } from '@/interface/user'
import { ShopCarItem } from 'src/interface/extension'
import { CouponUser } from '@/interface/payment'

const userinfo: User = {}
const couponUserList: Array<CouponUser> = []
const shopCar: Array<ShopCarItem> = []
const isLogin: boolean = !!localStorage.getItem('token')
// 高德地图amapKey
const aMapKey: string = ''

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
