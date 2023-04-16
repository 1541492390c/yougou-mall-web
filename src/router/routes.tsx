import { RouteObject } from 'react-router-dom'
import Index from '@/pages/index/Index'
import Login from '@/pages/login/Login'
import Register from '@/pages/register/Register'
import Home from '@/pages/home/Home'

const routes: Array<RouteObject> = [
    {
        path: '/*',
        element: <Index />,
        children: [
            {path: '*', element: <Home />}
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
]

export default routes