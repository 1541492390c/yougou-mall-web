import React, { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { message } from 'antd'

interface Props {
    children: ReactElement
}

const AuthRoute: React.FC<Props> = ({ children }): JSX.Element => {
    const isLogin = useSelector((state: any) => state.isLogin)
    return isLogin ? children : <Navigate to='/login' />
}

export default AuthRoute