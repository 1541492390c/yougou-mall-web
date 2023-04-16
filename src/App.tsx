import React from 'react'
import AppScrollTop from './AppScrollTop'
import { useRoutes } from 'react-router-dom'
import routes from '@/router/routes'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from '@/store'

const App: React.FC = () => {
    const transformRoutes = useRoutes(routes)
    return (
        <ConfigProvider theme={{token: {colorPrimary: '#f13a3a'}}}>
            <Provider store={store}>
                <AppScrollTop>
                    <>{transformRoutes}</>
                </AppScrollTop>
            </Provider>
        </ConfigProvider>
    )
}

export default App
