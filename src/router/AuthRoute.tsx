import React, { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

interface Props {
    children: ReactElement
}

const AuthRoute: React.FC<Props> = ({ children }) => {
    const isLogin = useSelector((state: any) => state.isLogin)
    return isLogin ? children : <Navigate to='/login' />
}

export default AuthRoute