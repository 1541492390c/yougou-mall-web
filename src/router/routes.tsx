import { RouteObject } from 'react-router-dom'
import Index from '@/pages/index/Index'
import Login from '@/pages/login/Login'
import Register from '@/pages/register/Register'
import Home from '@/pages/index/home/Home'
import Coupons from '@/pages/index/coupons/Coupons'
import Discount from '@/pages/index/discount/Discount'
import SecKills from '@/pages/index/sec-kills/SecKills'
import Brands from '@/pages/index/brands/Brands'
import Feedback from '@/pages/feedback/Feedback'
import UpdatePassword from '@/pages/update-password/UpdatePassword'
import Personal from '@/pages/personal/Personal'
import ProductDetail from '@/pages/product-detail/ProductDetail'
import AuthRoute from '@/router/AuthRoute'
import Settlement from '@/pages/settlement/Settlement'
import MyOrder from '@/pages/personal/my-order/MyOrder'
import Favorite from '@/pages/personal/favorite/Favorite'
import Addr from '@/pages/personal/addr/Addr'
import MyCoupon from '@/pages/personal/my-coupon/MyCoupon'
import Comment from '@/pages/comment/Comment'
import List from '@/pages/list/List'
import AccountSecurity from '@/pages/personal/account-security/AccountSecurity'
import MyFeedback from '@/pages/personal/my-feedback/MyFeedback'
import Payment from '@/pages/payment/Payment'
import PaymentSuccess from '@/pages/payment-success/PaymentSuccess'

const routes: Array<RouteObject> = [
    // 首页
    {
        path: '/*',
        element: <Index />,
        children: [
            {path: '*', element: <Home />},
            {path: 'discount', element: <Discount />},
            {path: 'sec_kills', element: <SecKills />},
            {path: 'brands', element: <Brands />},
            {path: 'coupons', element: <Coupons />},
            {path: 'list', element: <List />},
            {path: 'detail/:id', element: <ProductDetail />}
        ]
    },
    // 个人中心
    {
        path: '/personal/*',
        element: <AuthRoute><Personal /></AuthRoute>,
        children: [
            {path: '*', element: <AccountSecurity />},
            {path: 'my_order', element: <MyOrder />},
            {path: 'my_coupon', element: <MyCoupon />},
            {path: 'my_feedback', element: <MyFeedback />},
            {path: 'favorite', element: <Favorite />},
            {path: 'addr', element: <Addr />}
        ]
    },
    // 登录
    {
        path: '/login',
        element: <Login />
    },
    // 注册
    {
        path: '/register',
        element: <Register />
    },
    // 反馈
    {
        path: '/feedback',
        element: <Feedback />
    },
    // 更新密码
    {
        path: '/update_password',
        element: <UpdatePassword />
    },
    // 结算
    {
        path: '/settlement',
        element: <Settlement />
    },
    // 支付
    {
        path: '/payment',
        element: <Payment />
    },
    {
        path: '/payment_success',
        element: <PaymentSuccess />
    },
    // 评价
    {
        path: '/comment',
        element: <AuthRoute><Comment /></AuthRoute>
    }
]

export default routes