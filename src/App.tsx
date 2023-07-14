import React, { useEffect } from 'react'
import AppScrollTop from './AppScrollTop'
import { useRoutes } from 'react-router-dom'
import routes from '@/router/routes'
import { ConfigProvider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setShopCar, setUserinfo } from '@/store'
import { getUserinfoApi } from '@/api/user-api'
import Cookies from 'js-cookie'
import { Dispatch } from '@reduxjs/toolkit'

const AppHooks: any = (): any => {
    const dispatch: Dispatch = useDispatch()
    const isLogin: boolean = useSelector((state: any) => state.isLogin)
    const transformRoutes = useRoutes(routes)

    useEffect(() => {
        // 如果已登录则获取用户信息
        if (isLogin) {
            getUserinfoApi().then((res) => {
                dispatch(setUserinfo(res.data))
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
        <ConfigProvider theme={{token: {colorPrimary: '#f13a3a'}}}>
            <AppScrollTop>
                {transformRoutes}
            </AppScrollTop>
        </ConfigProvider>
    )
}

export default App
