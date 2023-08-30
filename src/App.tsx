import React, { useEffect } from 'react'
import AppScrollTop from './AppScrollTop'
import { useRoutes } from 'react-router-dom'
import routes from '@/router/routes'
import { ConfigProvider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setCouponUserList, setShopCar, setUserinfo } from '@/store/slice'
import { getUserinfoApi } from '@/api/user/user-api'
import Cookies from 'js-cookie'
import { Dispatch } from '@reduxjs/toolkit'
import zhCN from 'antd/locale/zh_CN'
import { getCouponUserListApi } from '@/api/payment/coupon-user-api'

const AppHooks: any = (): any => {
    const dispatch: Dispatch = useDispatch()
    const isLogin: boolean = useSelector((state: any) => state.isLogin)
    const transformRoutes: React.ReactElement | null = useRoutes(routes)

    useEffect(() => {
        if (isLogin) {
            // 获取用户信息
            getUserinfoApi().then((res) => {
                dispatch(setUserinfo(res.data))
            }).catch((err) => {
                console.log(err)
            })

            // 获取用户优惠券信息
            getCouponUserListApi().then((res) => {
                dispatch(setCouponUserList(res.data))
            }).catch((err) => {
                console.log(err)
            })
        }

        // 如果购物车不为空
        if (!!Cookies.get('shop_car')) {
            dispatch(setShopCar(JSON.parse(Cookies.get('shop_car') as string)))
        }
    }, [isLogin, dispatch])

    return {transformRoutes}
}

const App: React.FC = (): JSX.Element => {
    const {transformRoutes} = AppHooks()

    return (
        <ConfigProvider locale={zhCN} theme={{token: {colorPrimary: '#f13a3a', borderRadius: 0}}}>
            <AppScrollTop>{transformRoutes}</AppScrollTop>
        </ConfigProvider>
    )
}

export default App
