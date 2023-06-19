import { RouteObject } from 'react-router-dom'
import Index from '@/pages/index/Index'
import Login from '@/pages/login/Login'
import Register from '@/pages/register/Register'
import Home from '@/pages/home/Home'
import Coupons from '@/pages/coupons/Coupons'
import Discount from '@/pages/discount/Discount'
import SecKills from '@/pages/sec-kills/SecKills'
import Brands from '@/pages/brands/Brands'
import Feedback from '@/pages/feedback/Feedback'
import UpdatePassword from '@/pages/update-password/UpdatePassword'
import Personal from '@/pages/personal/Personal'
import ProductDetail from '@/pages/product-detail/ProductDetail'
import AuthRoute from '@/router/AuthRoute'

const routes: Array<RouteObject> = [
    {
        path: '/*',
        element: <Index />,
        children: [
            {path: '*', element: <Home />},
            {path: 'discount', element: <Discount />},
            {path: 'sec_kills', element: <SecKills />},
            {path: 'brands', element: <Brands />},
            {path: 'coupons', element: <Coupons />},
            {path: 'detail/:id', element: <ProductDetail />}
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/feedback',
        element: <Feedback />
    },
    {
        path: '/update_password',
        element: <UpdatePassword />
    },
    {
        path: '/personal',
        element: <AuthRoute><Personal /></AuthRoute>
    }
]

export default routes