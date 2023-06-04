import React, { useEffect } from 'react'
import AppScrollTop from './AppScrollTop'
import { useRoutes } from 'react-router-dom'
import routes from '@/router/routes'
import { ConfigProvider } from 'antd'
import { useDispatch, useSelector, useStore } from 'react-redux'
import store, { setUserinfo } from '@/store'
import { getUserinfoApi } from '@/api/user-api'

const AppHooks = (): any => {
    const store = useStore()
    const dispatch = useDispatch()
    const transformRoutes = useRoutes(routes)
    const isLogin = useSelector((state: any) => state.isLogin)

    useEffect(() => {
        if (isLogin) {
            getUserinfoApi().then((res) => {
                console.log(res.data)
                dispatch(setUserinfo(res.data))
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [])

    return {transformRoutes}
}

const App: React.FC = () => {
    const {transformRoutes} = AppHooks()

    return (
        <ConfigProvider theme={{token: {colorPrimary: '#f13a3a'}}}>
            <AppScrollTop>
                <>{transformRoutes}</>
            </AppScrollTop>
        </ConfigProvider>
    )
}

export default App
